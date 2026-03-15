import { Currency } from "../types/country.type";

export function formatPopulation(population: number): string {
    if (!population) return "N/A"
    else if (population > 1000000) {
      return (population / 1000000).toFixed(1) + "M";
    } else if (population > 1000) {
      return (population / 1000).toFixed(1) + "K";
    }
    return population.toString();
  }

export function formatCurrencies(currencies?: { [code: string]: Currency }): string {
    if (!currencies || Object.values(currencies).length === 0) return "N/A";
    return Object.values(currencies)
      .map((c: Currency) => c.name)
      .join(", ");
  }

export function formatLanguages(languages?: { [code: string]: string }): string {
  if (!languages || Object.values(languages).length === 0) return "N/A";
  return Object.values(languages).join(", ");
}

export function formatTimezones(timezones?: string[]): string {
    if(!timezones || timezones.length === 0) return "N/A";
    return timezones?.join(", ");
}

export function formatBorders(borders?: string[]): string {
    if (!borders || borders.length === 0) return "N/A";
    return borders.join(", ");
}
