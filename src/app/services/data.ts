import { Injectable } from '@angular/core';
import { Haus, Mieter } from '../models/immobilie.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private STORAGE_KEY = 'mein_vermieter_archiv';

  constructor() { 
    if (this.getHaeuser().length === 0) {
      const initialeHaeuser: Haus[] = [
        { id: 1, titel: 'Haus Zeil', strasse: 'Zeil 23', plz: '60313', stadt: 'Frankfurt am Main', bildUrl: 'zeil.png', mieter: [] },
        { id: 2, titel: 'Haus Allerheiligen', strasse: 'Allerheiligenstr. 32-34', plz: '60313', stadt: 'Frankfurt am Main', bildUrl: 'allerheilige.png', mieter: [] },
        { id: 3, titel: 'Haus Lange', strasse: 'Langestr. 29', plz: '60311', stadt: 'Frankfurt am Main', bildUrl: 'lang.png', mieter: [] },
        { id: 4, titel: 'Haus Lange-2', strasse: 'Langestr. 37-39', plz: '60311', stadt: 'Frankfurt am Main', bildUrl: 'lang37-39.png', mieter: [] },
        { id: 5, titel: 'Haus Zobel', strasse: 'Zobelstr. 5', plz: '60316', stadt: 'Frankfurt am Main', bildUrl: 'zobel.png', mieter: [] },
        { id: 6, titel: 'Haus Kaiser', strasse: 'Kaiserstr. 121', plz: '63065', stadt: 'Offenbach am Main', bildUrl: 'kaiser.png', mieter: [] },
        { id: 7, titel: 'Haus Taunus', strasse: 'Taunusstr. 59', plz: '63067', stadt: 'Offenbach am Main', bildUrl: 'taunus.png', mieter: [] },
      ];
      this.saveHaeuser(initialeHaeuser);
    }
  }

  getHaeuser(): Haus[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveHaeuser(haeuser: Haus[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(haeuser));
  }

  updateHaus(aktualisiertesHaus: Haus): void {
    const alleHaeuser = this.getHaeuser();
    const index = alleHaeuser.findIndex(h => h.id === aktualisiertesHaus.id);
    if (index !== -1) {
      alleHaeuser[index] = aktualisiertesHaus;
      this.saveHaeuser(alleHaeuser);
    }
  }

  getHausById(id: number): Haus | undefined {
    return this.getHaeuser().find(h => h.id === id);
  }

  exportDaten() {
    const daten = this.getHaeuser();
    const jsonString = JSON.stringify(daten, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vermieter_Backup_${new Date().toLocaleDateString()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  importDaten(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          
          const migrierteDaten = json.map((haus: any) => ({
            ...haus,
            mieter: (haus.mieter || []).map((m: any) => ({
              ...m,
              wohnungsNummer: m.wohnungsNummer || 'Unbekannt',
              flaeche: m.flaeche || 0,
              zimmer: m.zimmer || '1',
              mwst: m.mwst || 0,
              sonstige: m.sonstige || '',
              mietbeginn: m.mietbeginn || '',
              steuerId: m.steuerId || '',
              istBezahlt: m.istBezahlt || {}
            }))
          }));

          this.saveHaeuser(migrierteDaten);
          resolve();
        } catch (err) {
          reject('Ungültige JSON-Datei');
        }
      };
      reader.readAsText(file);
    });
  }
}