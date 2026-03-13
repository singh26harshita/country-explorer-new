import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { country } from "../../shared/types/country.type";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CountryService {
  private apiBaseUrl = "https://restcountries.com/v3.1";
  constructor(private http: HttpClient) {}

  getAll(): Observable<country[]> {
    return this.http
      .get<
        country[]
      >(`${this.apiBaseUrl}/all?fields=name,capital,region,population,area,currencies,languages,flags`)
      .pipe(
        catchError((error) => {
          console.log("Error while fetching list of all contries:", error);
          return of([]);
        }),
      );
  }

  getByCode(code: string): Observable<country[]> {
    return this.http.get<country[]>(`${this.apiBaseUrl}/alpha/${code}`).pipe(
      catchError((error) => {
        console.log("Error while fetching countries by code:", error);
        return of([]);
      }),
    );
  }

  searchByName(name: string): Observable<country[]> {
    return this.http.get<country[]>(`${this.apiBaseUrl}/name/${name}`).pipe(
      catchError((error) => {
        console.log("Error while fetching countries by name:", error);
        return of([]);
      }),
    );
  }

  getByRegion(region: string): Observable<country[]> {
    return this.http.get<country[]>(`${this.apiBaseUrl}/region/${region}`).pipe(
      catchError((error) => {
        console.log("Error while fetching countries by region:", error);
        return of([]);
      }),
    );
  }

  getByCodes(codes: string[]): Observable<country[]> {
    return this.http
      .get<country[]>(`${this.apiBaseUrl}/alpha?codes=${codes.join(",")}`)
      .pipe(
        catchError((error) => {
          console.log("Error while fetching countries by code:", error);
          return of([]);
        }),
      );
  }
}
