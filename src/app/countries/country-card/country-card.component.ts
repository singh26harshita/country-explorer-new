import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Country } from "../../shared/types/country.type";
import {
  formatCurrencies,
  formatLanguages,
  formatPopulation,
} from "../../shared/utils/country-utils";

@Component({
  selector: "app-country-card",
  standalone: false,
  templateUrl: "./country-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryCardComponent {
  @Input() country!: Country;

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
  }
}
