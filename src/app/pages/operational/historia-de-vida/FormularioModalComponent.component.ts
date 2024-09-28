import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario-modal',
  templateUrl: './formulario-modal.component.html',
  styleUrls: ['./formulario-modal.component.css']
})
export class FormularioModalComponent implements OnInit {
  healthHistoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormularioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibimos los datos para edición (si los hay)
  ) {}

  ngOnInit() {
    this.healthHistoryForm = this.fb.group({
      diagnosis: [this.data?.diagnosis || '', Validators.required],
      medicines: [this.data?.medicines || '', Validators.required],
      treatment_days: [this.data?.treatment_days || 0, Validators.required],
      description: [this.data?.description || ''],
      date: [this.data?.date || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.healthHistoryForm.valid) {
      // Cerrar el diálogo y pasar los datos del formulario
      this.dialogRef.close(this.healthHistoryForm.value);
    }
  }

  cancelar() {
    // Cerrar el diálogo sin pasar datos
    this.dialogRef.close();
  }
}
