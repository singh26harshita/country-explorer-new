export interface Country {
  flags: {
    png: string;
  };
  name: {
    common: string;
  };
  population: number;
  languages: {
    [code: string]: string;
  };
  region: string;
  currencies: {
    [code: string]: Currency;
  };
  area: number;
  capital: string;
  borders: Array<string>;
  timezones: Array<string>;
}

export type Currency = {
  name: string;
  symbol: string;
};

export type Options = {
  label: string;
  value: string;
};

export type loadingState = {
  state: "loading" | "error" | "success";
  errorMessage?: string;
};

export type filterState = {
  search: string;
  region: string;
  sort: string | null;
};
