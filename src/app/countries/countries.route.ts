import { Routes } from "@angular/router";
import { CountryListComponent } from "./country-list/country-list.component";
import { CountryCompareComponent } from "./country-compare/country-compare.component";


export const CountryRoutes: Routes = [
  { path: "", component: CountryListComponent },
  { path: "compare", component: CountryCompareComponent },
]; 