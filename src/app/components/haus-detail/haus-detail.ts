import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core';
import { DataService } from '../../services/data';
import { Haus, Mieter } from '../../models/immobilie.model';
import { MieterDialog } from './../mieter-dialog/mieter-dialog';
import { DeleteConfirm } from '../delete-confirm/delete-confirm';

@Component({
  selector: 'app-haus-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatButtonModule, 
    MatCheckboxModule, 
    MatDialogModule, 
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './haus-detail.html',
  styleUrl: './haus-detail.scss',
})
export class HausDetail implements OnInit {
  haus?: Haus;
  dataSource = new MatTableDataSource<Mieter>([]);
  displayedColumns: string[] = [
    'wohnungsNummer',
    'name',
    'steuerId',
    'stockwerk', 
    'zimmer', 
    'flaeche',
    'kaltmiete', 
    'nebenkosten',
    'mwst', 
    'gesamtmiete', 
    'bezahlterBetrag', // Neue Spalte integriert
    'bezahlt', 
    'aktionen'
  ];
  
  aktuellerMonat = ''; 
  verfuegbareMonate: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.generiereMonatsListe();

    const heute = new Date();
    this.aktuellerMonat = (heute.getMonth() + 1) + '-' + heute.getFullYear();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.haus = this.dataService.getHausById(id);
    
    if (this.haus) {
      this.dataSource.data = this.haus.mieter;
      
      this.dataSource.filterPredicate = (data: Mieter, filter: string) => {
        return data.name.toLowerCase().includes(filter.toLowerCase()) || 
               data.wohnungsNummer.toLowerCase().includes(filter.toLowerCase());
      };
    }
  }

  generiereMonatsListe() {
    const heute = new Date();
    for (let i = -6; i <= 6; i++) {
      const d = new Date(heute.getFullYear(), heute.getMonth() + i, 1);
      const monatJahr = (d.getMonth() + 1) + '-' + d.getFullYear();
      this.verfuegbareMonate.push(monatJahr);
    }
  }

  onMonatChange(neuerMonat: string) {
    this.aktuellerMonat = neuerMonat;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openMieterDialog() {
    const dialogRef = this.dialog.open(MieterDialog, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.haus) {
        const neueId = this.haus.mieter.length > 0 
          ? Math.max(...this.haus.mieter.map(m => m.id)) + 1 
          : 1;

        const neuerMieter: Mieter = {
          ...result,
          id: neueId,
          istBezahlt: {},
          bezahlteBetraege: {} // Initialisierung des neuen Feldes
        };

        this.haus.mieter.push(neuerMieter);
        this.updateTable();
      }
    });
  }

  // Korrigierte Methode für den Betrag (behebt TS2322)
  updateBetrag(mieter: Mieter, event: any) {
    const wert = event.target.value;
    const zahl = parseFloat(wert.replace(',', '.')); // Erlaubt Komma-Eingabe
    
    if (!mieter.bezahlteBetraege) {
      mieter.bezahlteBetraege = {};
    }
    
    // Wir speichern es als Zahl, falls gültig, sonst als 0
    mieter.bezahlteBetraege[this.aktuellerMonat] = !isNaN(zahl) ? zahl : 0;
    this.saveChanges();
  }

  toggleBezahlt(mieter: Mieter) {
    if (!mieter.istBezahlt) mieter.istBezahlt = {};
    const neuerStatus = !mieter.istBezahlt[this.aktuellerMonat];
    mieter.istBezahlt[this.aktuellerMonat] = neuerStatus;
    
    // Komfort-Funktion: Betrag automatisch füllen, wenn Häkchen gesetzt wird
    if (neuerStatus) {
       if (!mieter.bezahlteBetraege) mieter.bezahlteBetraege = {};
       mieter.bezahlteBetraege[this.aktuellerMonat] = mieter.gesamtmiete;
    }
    
    this.saveChanges();
  }

  editMieter(mieter: Mieter) {
    const passwordDialogRef = this.dialog.open(DeleteConfirm, {
      width: '350px',
      disableClose: true,
      data: { mode: 'edit' }
    });

    passwordDialogRef.afterClosed().subscribe(isPasswordCorrect => {
      if (isPasswordCorrect) {
        const editDialogRef = this.dialog.open(MieterDialog, {
          width: '500px',
          data: { ...mieter }
        });

        editDialogRef.afterClosed().subscribe(result => {
          if (result && this.haus) {
            const index = this.haus.mieter.findIndex(m => m.id === mieter.id);
            if (index !== -1) {
              this.haus.mieter[index] = { ...result, id: mieter.id };
              this.updateTable();
            }
          }
        });
      }
    });
  }

  deleteMieter(mieterId: number) {
    const dialogRef = this.dialog.open(DeleteConfirm, {
      width: '350px',
      disableClose: true,
      data: { mode: 'delete' }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && this.haus) {
        this.haus.mieter = this.haus.mieter.filter(m => m.id !== mieterId);
        this.updateTable();
      }
    });
  }

  private updateTable() {
    if (this.haus) {
      this.dataSource.data = [...this.haus.mieter];
      this.saveChanges();
    }
  }

  private saveChanges() {
    if (this.haus) {
      this.dataService.updateHaus(this.haus);
    }
  }

  get bezahltCounter(): string {
    if (!this.haus) return '';
    const aktuelleListe = this.dataSource.filteredData;
    const gezahlt = aktuelleListe.filter(m => m.istBezahlt?.[this.aktuellerMonat]).length;
    const gesamt = aktuelleListe.length;
    
    return `${gezahlt} von ${gesamt} Mieten erhalten (${this.aktuellerMonat})`;
  }

  drucken() {
    window.print();
  }
}