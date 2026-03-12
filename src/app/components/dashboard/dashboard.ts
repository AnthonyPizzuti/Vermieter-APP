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

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.haeuser = this.dataService.getHaeuser();
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