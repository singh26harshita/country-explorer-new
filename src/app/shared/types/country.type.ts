export type Country = {
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
  borders: string[];
  timezones: string[];
};

export type Currency = {
  name: string;
  symbol: string;
};

export type Options = {
  label: string;
  value: string;
};
