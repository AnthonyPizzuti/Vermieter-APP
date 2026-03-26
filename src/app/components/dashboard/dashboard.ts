import { Component, OnInit } from '@angular/core';
import { DataService } from './../../services/data';
import { Haus } from '../../models/immobilie.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  haeuser: Haus[] = [];

  begruessungPrefix = '';
  begruessungSuffix = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.haeuser = this.dataService.getHaeuser();
    this.berechneTageszeit();
  }

  private berechneTageszeit() {
    const stunde = new Date().getHours();

    if (stunde >= 5 && stunde < 11) {
      // 5:00 - 10:59: Dobro jutro
      this.begruessungPrefix = 'Dobro';
      this.begruessungSuffix = 'jutro';
    } else if (stunde >= 11 && stunde < 18) {
      // 11:00 - 17:59: Dobar dan
      this.begruessungPrefix = 'Dobar';
      this.begruessungSuffix = 'dan';
    } else {
      // 18:00 - 4:59: Dobro veče
      this.begruessungPrefix = 'Dobro';
      this.begruessungSuffix = 'veče';
    }
  }

  exportiere() {
    this.dataService.exportDaten();
  }

  importiere(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.dataService.importDaten(file).then(() => {
        this.haeuser = this.dataService.getHaeuser();
        alert('Daten erfolgreich geladen!');
      });
    }
  }
}