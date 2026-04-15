import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CountryService } from "../../core/service/country.service";
import {
  Country,
  loadingState,
  Options,
} from "../../shared/types/country.type";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  tap,
} from "rxjs/operators";
import {
  REGION_FILTER_VALUES,
  SORT_OPTIONS,
} from "../../shared/constants/app.constants";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { signal } from "@angular/core";
import {
  formatCurrencies,
  transformCurrenciesData,
  transformLanguage,
} from "../../shared/utils/country-utils";

@Component({
  selector: "app-country-list",
  standalone: false,
  templateUrl: "./country-list.component.html",
  styleUrls: ["./country-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit {
  protected readonly regions = REGION_FILTER_VALUES;
  protected readonly sortOptions = SORT_OPTIONS;
  protected countries = signal<Country[]>([]);
  protected loadingState = signal<loadingState>({ state: "loading" });
  protected filteredCountries = signal<Country[]>([]);
  protected countriesToCompare = signal<Country[]>([]);
  private destroyRef = inject(DestroyRef);
  private countryService = inject(CountryService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  protected readonly currencies = signal<Options[]>([]);
  protected readonly languages = signal<Options[]>([]);

  protected filterForm = new FormGroup({
    search: new FormControl(""),
    region: new FormControl(""),
    sortBy: new FormControl("name"),
    currency: new FormControl(""),
    language: new FormControl(""),
  });

  countries$ = this.filterForm.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((value: any | null) => {
      console.log("searchTerm:", value["searchTerm"]);
      this.loadingState.set({ state: "loading" });
      if (!value["searchTerm"] || value["searchTerm"].trim() === "") {
        this.loadingState.set({
          state: "error",
          errorMessage: "No search term entered. Please try again.",
        });
        return of([]);
      }
      return this.countryService.searchByName(value["searchTerm"]).pipe(
        tap(() => this.loadingState.set({ state: "success" })),
        catchError(() => {
          this.loadingState.set({
            state: "error",
            errorMessage: "Country not found.Please try another country",
          });
          return of([]);
        }),
      );
    }),
    takeUntilDestroyed(this.destroyRef),
  );
  countriesSignal = toSignal(this.countries$, { initialValue: [] });

  ngOnInit(): void {
    this.loadCountries();
    this.activatedRoute.queryParams.subscribe((param) => {
      console.log(param);
      if (Object.keys(param).length > 0) {
        this.filterForm.patchValue({
          search: param["search"] || "",
          sortBy: param["sortBy"] || "name",
          region: param["region"] || "",
        });
        this.applyFilters();
      }
      // if (param["search"]) {
      //   this.filterForm.get("search")?.patchValue(param["search"]);
      // }
      // if (param["sortBy"]) {
      //   this.filterForm.get("sortBy")?.patchValue(param["sortBy"]);
      // }
      // if (param["region"]) {
      //   this.filterForm.get("region")?.patchValue(param["region"]);
      // }
    });

    // this.filterForm
    //   .get("region")
    //   ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(() => this.applyFilters());

    // this.filterForm
    //   .get("sortBy")
    //   ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(() => this.applyFilters());

    // this.filterForm
    //   .get("currency")
    //   ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(() => {
    //     this.applyFilters();
    //   });

    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyFilters());
  }

  loadCountries(): void {
    this.loadingState.set({ state: "loading" });
    this.countryService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.countries.set(data);
          this.loadingState.set({ state: "success" });
          this.applyFilters();
          this.createCurrencyFilterOptions();
          this.createLanguageListOptions();
        },
        error: () => {
          this.countries.set([]);
          this.loadingState.set({
            state: "error",
            errorMessage: "Failed to load countries. Please try again later.",
          });
          this.applyFilters();
        },
      });
  }

  createCurrencyFilterOptions(): void {
    let currencies: Array<Options> = [];
    this.filteredCountries().forEach((country) => {
      //console.log(transformCurrenciesData(country.currencies));
      const currencyList = transformCurrenciesData(country.currencies);

      if (currencyList && Array.isArray(currencyList)) {
        currencyList.forEach((item) => {
          const exists = currencies.some((c) => c.value === item.value);
          if (!exists) {
            currencies.push(item);
          }
        });
      }
    });
    //console.log("currencies:", currencies);
    this.currencies.set(currencies);
  }

  createLanguageListOptions(): void {
    let languages: Array<Options> = [];
    this.filteredCountries().forEach((lang) => {
      const langOption = transformLanguage(lang.languages);
      langOption.forEach((item) => {
        const exist = languages.some((l) => l.value === item.value);
        if (!exist) {
          languages.push(item);
        }
      });
      this.languages.set(languages);
    });
  }

  applyFilters(): void {
    let result: Country[] = [...this.countries()];
    result = this.searchCountry(result);
    console.log("search country:", result);
    result = this.searchRegion(result);
    console.log("search Region:", result);

    result = this.sortBy(result);
    console.log("search sortBy:", result);

    result = this.searchCurrency(result);
    result = this.searchLanguage(result);
    this.filteredCountries.set(result);
  }

  searchLanguage(result: Country[]): Country[] {
    const language = this.filterForm.get("language")!.value;
    //console.log(language);

    if (!language) return result;
    return result.filter((c: Country) => {
      const exists = Object.keys(c.languages).some((lang) => lang === language);
      return exists;
    });
  }

  searchCountry(result: Country[]): Country[] {
    const searchTerm =
      this.filterForm.get("search")!.value?.toLowerCase() || "";
    if (!searchTerm) return result;
    const filterState = this.countryService.getFilterState();
    this.countryService.updateFilterState({
      ...filterState,
      search: searchTerm,
    });
    return result.filter((country: Country) =>
      country.name.common.toLowerCase().includes(searchTerm),
    );
  }

  searchRegion(result: Country[]): Country[] {
    const region = this.filterForm.get("region")!.value;
    if (!region) return result;
    const filterState = this.countryService.getFilterState();
    this.countryService.updateFilterState({
      ...filterState,
      region: region,
    });
    return result.filter((country: Country) => country.region === region);
  }

  searchCurrency(result: Country[]): Country[] {
    const currency = this.filterForm.get("currency")!.value;
    //console.log("currency:", currency);
    if (!currency) return result;
    return result.filter((country: Country) => {
      const exists = Object.keys(country.currencies).some(
        (c) => c === currency,
      );
      return exists;
    });
  }

  sortBy(result: Country[]): Country[] {
    const sortBy = this.filterForm.get("sortBy")!.value;
    if (result.length <= 1) return result;
    const filterState = this.countryService.getFilterState();
    console.log("sort:", sortBy);
    this.countryService.updateFilterState({
      ...filterState,
      sort: sortBy,
    });
    if (sortBy === "name") {
      return [...result].sort((a, b) =>
        a.name.common.localeCompare(b.name.common),
      );
    } else if (sortBy === "population") {
      return [...result].sort((a, b) => b.population - a.population);
    } else if (sortBy === "area") {
      return [...result].sort((a, b) => b.area - a.area);
    }
    return result;
  }

  clearFilters(): void {
    const filterState = this.countryService.getFilterState();
    console.log("filterState:", filterState);
    // this.filterForm.get("search")!.setValue("");
    // this.filterForm.get("region")!.setValue("");
    // this.filterForm.get("sortBy")!.setValue("name");
    this.filterForm.reset();
    this.filterForm.updateValueAndValidity();
  }

  onCompareChecked(selectedCountry: Country, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.countriesToCompare.update((countries: Country[]) => {
      if (checkbox.checked) {
        if (this.countriesToCompare().length >= 3) {
          return countries;
        }
        return [...countries, selectedCountry];
      } else {
        return countries.filter(
          (country: Country) =>
            country.name.common !== selectedCountry.name.common,
        );
      }
    });
  }

  isCountrySelected(country: Country): boolean {
    return this.countriesToCompare().some(
      (selectedCountry) => country.name.common === selectedCountry.name.common,
    );
  }

  isCompareDisabled(country: Country): boolean {
    if (this.isCountrySelected(country)) {
      return false;
    } else {
      return this.countriesToCompare().length >= 3;
    }
  }

  compareCountries(): void {
    this.router.navigate(["countries/compare"], {
      state: { countries: this.countriesToCompare() },
    });
  }

  trackByCountryName(index: number, country: Country) {
    return country.name.common;
  }
}
