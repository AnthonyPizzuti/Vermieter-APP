import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'edit' ? 'Bearbeiten bestätigen' : 'Mieter unwiderruflich löschen?' }}</h2>
    
    <mat-dialog-content>
      <p>Bitte geben Sie das Administrator-Passwort ein, um den Vorgang zu bestätigen:</p>
      
      <mat-form-field appearance="outline" style="width: 100%; margin-top: 10px;">
        <mat-label>Passwort</mat-label>
        <input matInput type="password" [(ngModel)]="inputPassword" (keyup.enter)="check()" placeholder="Passwort...">
      </mat-form-field>
      
      <p *ngIf="showError" style="color: #f44336; font-size: 0.8rem; margin-top: 5px;">
        Falsches Passwort! Zugriff verweigert.
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Abbrechen</button>
      
      <button mat-raised-button 
              [color]="data.mode === 'edit' ? 'primary' : 'warn'" 
              (click)="check()">
        {{ data.mode === 'edit' ? 'Freischalten' : 'Löschen' }}
      </button>
    </mat-dialog-actions>
  `
})
export class DeleteConfirm {
  inputPassword = '';
  showError = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'edit' | 'delete' } // Empfängt den Modus
  ) {}

  check() {
    if (this.inputPassword === 'janjic') {
      this.dialogRef.close(true);
    } else {
      this.showError = true;
      this.inputPassword = '';
    }
  }
}