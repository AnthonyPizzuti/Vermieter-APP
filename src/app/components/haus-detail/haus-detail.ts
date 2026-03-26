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
    MatTooltipModule
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
    'kaution',
    'sonstige',
    'mietbeginn',
    'bezahlt', 
    'aktionen'
  ];
  
  aktuellerMonat = new Date().getMonth() + 1 + '-' + new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openMieterDialog() {
    const dialogRef = this.dialog.open(MieterDialog, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.haus) {
        const neueId = this.haus.mieter.length > 0 
          ? Math.max(...this.haus.mieter.map(m => m.id)) + 1 
          : 1;

        const neuerMieter: Mieter = {
          ...result,
          id: neueId,
          istBezahlt: {}
        };

        this.haus.mieter.push(neuerMieter);
        this.updateTable();
      }
    });
  }

  toggleBezahlt(mieter: Mieter) {
    if (!mieter.istBezahlt) mieter.istBezahlt = {};
    mieter.istBezahlt[this.aktuellerMonat] = !mieter.istBezahlt[this.aktuellerMonat];
    this.saveChanges();
  }

  editMieter(mieter: Mieter) {
    const dialogRef = this.dialog.open(MieterDialog, {
      width: '500px',
      data: { ...mieter }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.haus) {
        const index = this.haus.mieter.findIndex(m => m.id === mieter.id);
        if (index !== -1) {
          this.haus.mieter[index] = { ...result, id: mieter.id };
          this.updateTable();
        }
      }
    });
  }

  deleteMieter(mieterId: number) {
    const dialogRef = this.dialog.open(DeleteConfirm, {
      width: '350px',
      disableClose: true
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
      const alleHaeuser = this.dataService.getHaeuser();
      const index = alleHaeuser.findIndex(h => h.id === this.haus?.id);
      if (index !== -1) {
        alleHaeuser[index] = this.haus;
        this.dataService.saveHaeuser(alleHaeuser);
      }
    }
  }

  get bezahltCounter(): string {
    if (!this.haus) return '';
    const aktuelleListe = this.dataSource.filteredData;
    const gezahlt = aktuelleListe.filter(m => m.istBezahlt?.[this.aktuellerMonat]).length;
    const gesamt = aktuelleListe.length;
    
    return `${gezahlt} von ${gesamt} Mieten erhalten`;
  }
}