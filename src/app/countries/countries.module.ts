import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryCardComponent } from './country-card/country-card.component';
import { SharedModule } from '../shared/shared.module';
import { CountryCompareComponent } from "./country-compare/country-compare.component";
import { CountryRoutes } from "./countries.route";
@NgModule({
  declarations: [
    CountryListComponent,
    CountryCardComponent,
    CountryCompareComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(CountryRoutes),
  ],
})
export class CountriesModule {}
