import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CountryService } from "../../core/service/country.service";
import { Country } from "../../shared/types/country.type";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-country-list",
  standalone: false,
  templateUrl: "./country-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit {
  protected countries = signal<Country[]>([]);
  protected loading = signal<boolean>(false);
  protected filteredCountries = signal<Country[]>([]);
  private destroyRef = inject(DestroyRef);
  private countryService = inject(CountryService);

  filterForm = new FormGroup({
    search: new FormControl(""),
    region: new FormControl(""),
    sortBy: new FormControl("name"),
  });

  regions = [
    { label: "Africa", value: "Africa" },
    { label: "Americas", value: "Americas" },
    { label: "Antarctic", value: "Antarctic" },
    { label: "Asia", value: "Asia" },
    { label: "Europe", value: "Europe" },
    { label: "Oceania", value: "Oceania" },
  ];

  sortOptions = [
    { label: "Name", value: "name" },
    { label: "Population", value: "population" },
    { label: "Area", value: "area" },
  ];

  ngOnInit(): void {
    this.loadCountries();

    this.filterForm
      .get("search")
      ?.valueChanges.pipe(
        debounceTime(400),
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
          this.applyFilters();
        },
        complete: () => this.loading.set(false),
      });
  }

  applyFilters(): void {
    let result: Country[] = [...this.countries()];

    const searchTerm = this.filterForm.get("search")!.value;
    console.log("filter applied", searchTerm);
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
      result.sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common),
      );
    } else if (sortBy === "population") {
      result.sort((a: Country, b: Country) => b.population - a.population);
    } else if (sortBy === "area") {
      result.sort((a: Country, b: Country) => b.area - a.area);
    }

    this.filteredCountries.set(result);
  }

  clearFilters(): void {
    this.filterForm.get("search")!.setValue("");
    this.filterForm.get("region")!.setValue("");
    this.filterForm.get("sortBy")!.setValue("name");
  }
}
