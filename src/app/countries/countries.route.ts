import { Routes } from "@angular/router";
import { CountryListComponent } from "./country-list/country-list.component";
import { CountryCompareComponent } from "./country-compare/country-compare.component";


export const CountryRoutes: Routes = [
  {
    path: "country-list",
    component: CountryListComponent,
  },
  { path: "compare", component: CountryCompareComponent },
  // { path: "country-details", component: CountryDetailComponent },
  { path: "", pathMatch: "full", redirectTo: "country-list" },
  { path: "**", redirectTo: "country-list" },
]; 