import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-mieter-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  templateUrl: './mieter-dialog.html',
  styleUrl: './mieter-dialog.scss'
})
export class MieterDialog {
  mieterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    stockwerk: new FormControl('', [Validators.required]),
    zimmer: new FormControl(1, [Validators.required, Validators.min(1)]),
    kaltmiete: new FormControl(0, [Validators.required, Validators.min(0)]),
    nebenkosten: new FormControl(0, [Validators.required, Validators.min(0)]),
    gesamtmiete: new FormControl({ value: 0, disabled: true }),
    kaution: new FormControl(0, [Validators.required, Validators.min(0)])
  });

  constructor(public dialogRef: MatDialogRef<MieterDialog>) {
    this.mieterForm.valueChanges.subscribe(values => {
      const gesamt = (values.kaltmiete || 0) + (values.nebenkosten || 0);
      this.mieterForm.patchValue({ gesamtmiete: gesamt }, { emitEvent: false });
    });
  }

  speichern() {
    if (this.mieterForm.valid) {
      this.dialogRef.close(this.mieterForm.getRawValue());
    }
  }
}