export type Country = {
  flags: {
    png: string;
  };
  name: {
    common: string;
  };
  population: number;
  languages: string;
  region: string;
  currencies: Currency[];
  area: number;
  capital: string;
};

export type Currency = {
  name: string;
  sign: string;
};

export type Options = {
  label: string;
  value: string;
};
