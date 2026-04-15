import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CountryService } from './country.service';
import { API_BASE_URL } from '../../shared/constants/app.constants';
import { Country } from '../../shared/types/country.type';

const mockCountries: Country[] = [
  {
    name: { common: 'India' },
    capital: 'New Delhi',
    region: 'Asia',
    population: 1000000,
    area: 3287263,
    currencies: { INR: { name: 'Indian rupee', symbol: '₹' } },
    languages: { hin: 'Hindi', eng: 'English' },
    flags: { png: 'flag.png' },
    borders: ['PAK', 'CHN'],
    timezones: ['UTC+05:30']
  }
];

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all countries (success)', (done) => {
    service.getAll().subscribe((countries) => {
      expect(countries).toEqual(mockCountries);
      done();
    });
    const req = httpMock.expectOne(
      `${API_BASE_URL}/all?fields=name,capital,region,population,area,currencies,languages,flags,borders,timezones`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCountries);
  });

  it("should emit error when request fails", (done) => {
    service.getAll().subscribe({
      next: () => {
        done.fail("Expected error but got success response");
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe("Server error");
        done();
      },
    });
    const req = httpMock.expectOne(
      `${API_BASE_URL}/all?fields=name,capital,region,population,area,currencies,languages,flags,borders,timezones`,
    );
    expect(req.request.method).toBe("GET");
    req.flush("something went wrong", {
      status: 500,
      statusText: "Server error",
    });
  });
});
