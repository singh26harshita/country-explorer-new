import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Country } from "../../shared/types/country.type";
import { Router } from "@angular/router";
import { formatBorders, formatCurrencies, formatLanguages, formatPopulation, formatTimezones } from "../../shared/utils/country-utils";

@Component({
  selector: "app-country-compare",
  standalone: false,
  templateUrl: "./country-compare.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryCompareComponent {
  countriesToCompare: Country[] = [];

  constructor(private router: Router) {
    const navItems = this.router.getCurrentNavigation();
    this.countriesToCompare = navItems?.extras?.state?.["countries"] || [];
  }

  getPopulation(country: Country): string {
    return formatPopulation(country?.population);
  }

  getCurrencies(country: Country): string {
    return formatCurrencies(country?.currencies);
  }

  getLanguages(country: Country): string {
    return formatLanguages(country?.languages);
  }

  getTimeZones(country: Country): string {
    return formatTimezones(country?.timezones);
  }

  getBorders(country: Country): string {
    return formatBorders(country?.borders);
  }
}
