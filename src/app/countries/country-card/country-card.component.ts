import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from "@angular/core";
import { Country } from "../../shared/types/country.type";
import {
  formatCurrencies,
  formatLanguages,
  formatPopulation,
} from "../../shared/utils/country-utils";
import { Router } from "@angular/router";

@Component({
  selector: "app-country-card",
  standalone: false,
  templateUrl: "./country-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryCardComponent {
  @Input() country!: Country;
  private router = inject(Router);

  getPopulation(): string {
    return formatPopulation(this.country?.population);
  }

  getCurrencies(): string {
    return formatCurrencies(this.country?.currencies);
  }

  getLanguages(): string {
    return formatLanguages(this.country?.languages);
  }

  onCardClick(): void {
    console.log("Country clicked:", this.country.name.common);
    this.router.navigate(["countries/country-details"], {
      state: { selectedCountry: this.country },
    });
  }
}
