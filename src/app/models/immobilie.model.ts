export interface Mieter {
  id: number;
  name: string;
  stockwerk: string;
  zimmer: number;
  kaltmiete: number;
  nebenkosten: number;
  gesamtmiete: number;
  kaution: number;
  istBezahlt: { [key: string]: boolean };
}

export interface Haus {
  id: number;
  titel: string;
  strasse: string;
  plz: string;
  stadt: string;
  bildUrl: string;
  mieter: Mieter[];
}