import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Country } from "../../shared/types/country.type";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CountryService {
  private apiBaseUrl = "https://restcountries.com/v3.1";
  constructor(private http: HttpClient) {}

  getAll(): Observable<Country[]> {
    return this.http
      .get<
        Country[]
      >(`${this.apiBaseUrl}/all?fields=name,capital,region,population,area,currencies,languages,flags`)
      .pipe(
        catchError((error) => {
          console.log("Error while fetching list of all contries:", error);
          return of([]);
        }),
      );
  }

  getByCode(code: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiBaseUrl}/alpha/${code}`).pipe(
      catchError((error) => {
        console.log("Error while fetching countries by code:", error);
        return of([]);
      }),
    );
  }

  searchByName(name: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiBaseUrl}/name/${name}`).pipe(
      catchError((error) => {
        console.log("Error while fetching countries by name:", error);
        return of([]);
      }),
    );
  }

  getByRegion(region: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiBaseUrl}/region/${region}`).pipe(
      catchError((error) => {
        console.log("Error while fetching countries by region:", error);
        return of([]);
      }),
    );
  }

  getByCodes(codes: string[]): Observable<Country[]> {
    return this.http
      .get<Country[]>(`${this.apiBaseUrl}/alpha?codes=${codes.join(",")}`)
      .pipe(
        catchError((error) => {
          console.log("Error while fetching countries by code:", error);
          return of([]);
        }),
      );
  }
}
