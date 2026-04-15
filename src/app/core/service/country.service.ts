import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Country, filterState } from "../../shared/types/country.type";
import { catchError } from "rxjs/operators";
import { API_BASE_URL } from "../../shared/constants/app.constants";

@Injectable({
  providedIn: "root",
})
export class CountryService {
  constructor(private http: HttpClient) {}

  private readonly apiBaseUrl = API_BASE_URL;
 
  private filterState = signal<filterState>({
    search: "",
    region: "",
    sort: "",
  });

  getAll(): Observable<Country[]> {
    return this.http.get<Country[]>(
      `${this.apiBaseUrl}/all?fields=name,capital,region,population,area,currencies,languages,flags,borders,timezones`,
    );
  }

  getByCode(code: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiBaseUrl}/alpha/${code}`);
  }

  searchByName(name: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiBaseUrl}/name/${name}`);
  }

  getByRegion(region: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiBaseUrl}/region/${region}`);
  }

  getByCodes(codes: string[]): Observable<Country[]> {
    return this.http.get<Country[]>(
      `${this.apiBaseUrl}/alpha?codes=${codes.join(",")}`,
    );
  }

  updateFilterState(filter: filterState): void {
    this.filterState.set({
      ...this.filterState(),
      ...filter,
    });
  }

  getFilterState(): filterState {
    return this.filterState();
  }
}
