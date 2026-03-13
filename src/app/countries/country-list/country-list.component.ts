import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { CountryService } from "../../core/service/country.service";
import { country } from "../../shared/types/country.type";

@Component({
  selector: "app-country-list",
  standalone: false,
  templateUrl: "./country-list.component.html",
})
export class CountryListComponent implements OnInit, OnDestroy {
  countries: country[] = [];
  filteredCountries: country[] = [];
  loading = false;
  subscription = new Subscription();

  // filterForm = new UntypedFormGroup({
  //   search: new UntypedFormControl(''),
  //   region: new UntypedFormControl(''),
  //   sortBy: new UntypedFormControl('name')
  // });
  filterForm = new FormGroup({
    search: new FormControl(""),
    region: new FormControl(""),
    sortBy: new FormControl("name"),
  });

  regions = ["Africa", "Americas", "Antarctic", "Asia", "Europe", "Oceania"];

  sortOptions = [
    { label: "Name", value: "name" },
    { label: "Population", value: "population" },
    { label: "Area", value: "area" },
  ];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadCountries();

    this.subscription.add(
      this.filterForm.get("search")!.valueChanges.subscribe((value: any) => {
        this.applyFilters();
      }),
    );

    this.subscription.add(
      this.filterForm.get("region")!.valueChanges.subscribe((value: any) => {
        this.applyFilters();
      }),
    );

    this.subscription.add(
      this.filterForm.get("sortBy")!.valueChanges.subscribe((value: any) => {
        this.applyFilters();
      }),
    );
  }

  loadCountries(): void {
    this.loading = true;
    this.subscription.add(
      this.countryService.getAll().subscribe((data: country[]) => {
        this.countries = data;
        this.filteredCountries = data;
        this.loading = false;
        this.applyFilters();
      }),
    );
  }

  applyFilters(): void {
    let result: country[] = [...this.countries];

    const searchTerm = this.filterForm.get("search")!.value;
    if (searchTerm) {
      result = result.filter((country: country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    const region = this.filterForm.get("region")!.value;
    if (region) {
      result = result.filter((country: country) => country.region === region);
    }

    const sortBy = this.filterForm.get("sortBy")!.value;
    if (sortBy === "name") {
      result.sort((a: country, b: country) =>
        a.name.common.localeCompare(b.name.common),
      );
    } else if (sortBy === "population") {
      result.sort((a: country, b: country) => b.population - a.population);
    } else if (sortBy === "area") {
      result.sort((a: country, b: country) => b.area - a.area);
    }

    this.filteredCountries = result;
  }

  clearFilters(): void {
    this.filterForm.get("search")!.setValue("");
    this.filterForm.get("region")!.setValue("");
    this.filterForm.get("sortBy")!.setValue("name");
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
