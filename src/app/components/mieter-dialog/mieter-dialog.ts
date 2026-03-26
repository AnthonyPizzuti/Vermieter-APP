import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
export class MieterDialog implements OnInit {
  mieterForm = new FormGroup({
    wohnungsNummer: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    stockwerk: new FormControl('', [Validators.required]),
    zimmer: new FormControl('', [Validators.required]),
    flaeche: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    kaltmiete: new FormControl(0, [Validators.required, Validators.min(0)]),
    nebenkosten: new FormControl(0, [Validators.required, Validators.min(0)]),
    mwst: new FormControl(0, [Validators.min(0)]),
    gesamtmiete: new FormControl({ value: 0, disabled: true }),
    kaution: new FormControl(0, [Validators.required, Validators.min(0)]),
    steuerId: new FormControl(''),
    sonstige: new FormControl(''),
    mietbeginn: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<MieterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
 this.mieterForm.valueChanges.subscribe(values => {
    const kalt = Number(values.kaltmiete) || 0;
    const neben = Number(values.nebenkosten) || 0;
    const mwst = Number(values.mwst) || 0;
    const gesamt = parseFloat((kalt + neben + mwst).toFixed(2));
    this.mieterForm.patchValue({ gesamtmiete: gesamt }, { emitEvent: false });
  });
}

  ngOnInit(): void {
    if (this.data) {
      this.mieterForm.patchValue(this.data);
    }
  }

  speichern() {
    if (this.mieterForm.valid) {
      this.dialogRef.close(this.mieterForm.getRawValue());
    }
  }
}