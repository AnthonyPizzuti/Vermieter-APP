export interface Mieter {
  wohnungsNummer: string;
  id: number;
  name: string;
  stockwerk: string;
  zimmer: string;
  flaeche: number;
  kaltmiete: number;
  nebenkosten: number;
  mwst: number;
  gesamtmiete: number;
  kaution: number;
  steuerId?: string;
  istBezahlt: { [key: string]: boolean };
  bezahlteBetraege?: { [key: string]: number };
  sonstige?: string;
  mietbeginn?: string;
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