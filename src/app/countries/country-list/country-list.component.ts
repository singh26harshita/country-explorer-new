import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CountryService } from "../../core/service/country.service";
import { Country } from "../../shared/types/country.type";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  REGION_FILTER_VALUES,
  SORT_OPTIONS,
} from "../../shared/constants/app.constants";
import { Router } from "@angular/router";

@Component({
  selector: "app-country-list",
  standalone: false,
  templateUrl: "./country-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit {
  protected readonly regions = REGION_FILTER_VALUES;
  protected readonly sortOptions = SORT_OPTIONS;
  protected countries = signal<Country[]>([]);
  protected loading = signal<boolean>(false);
  protected filteredCountries = signal<Country[]>([]);
  protected countriesToCompare = signal<Country[]>([]);
  protected error = signal<string | null>(null);
  private destroyRef = inject(DestroyRef);
  private countryService = inject(CountryService);
  private router = inject(Router);

  protected filterForm = new FormGroup({
    search: new FormControl(""),
    region: new FormControl(""),
    sortBy: new FormControl("name"),
  });

  ngOnInit(): void {
    this.loadCountries();

    this.filterForm
      .get("search")
      ?.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.applyFilters());

    this.filterForm
      .get("region")
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyFilters());

    this.filterForm
      .get("sortBy")
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyFilters());
  }

  loadCountries(): void {
    this.loading.set(true);
    this.countryService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.countries.set(data);
          this.applyFilters();
        },
        error: () => {
          this.countries.set([]);
          this.error.set("Failed to load countries. Please try again later.");
          this.applyFilters();
        },
        complete: () => this.loading.set(false),
      });
  }

  applyFilters(): void {
    let result: Country[] = [...this.countries()];

    const searchTerm = this.filterForm.get("search")!.value;
    if (searchTerm) {
      result = result.filter((country: Country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    const region = this.filterForm.get("region")!.value;
    if (region) {
      result = result.filter((country: Country) => country.region === region);
    }

    const sortBy = this.filterForm.get("sortBy")!.value;
    if (sortBy === "name") {
      result = [...result].sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common),
      );
    } else if (sortBy === "population") {
      result = [...result].sort(
        (a: Country, b: Country) => b.population - a.population,
      );
    } else if (sortBy === "area") {
      result = [...result].sort((a: Country, b: Country) => b.area - a.area);
    }

    this.filteredCountries.set(result);
  }

  clearFilters(): void {
    this.filterForm.get("search")!.setValue("");
    this.filterForm.get("region")!.setValue("");
    this.filterForm.get("sortBy")!.setValue("name");
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
    if (this.isCountrySelected(country)) return false;
    else return this.countriesToCompare().length >= 3;
  }

  compareCountries(): void {
    this.router.navigate(["countries/compare"], {
      state: { countries: this.countriesToCompare() },
    });
  }
}
