import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; // Import necesario para la tabla

@Component({
  selector: 'app-historia-de-vida',
  standalone: true,
  imports: [],
  templateUrl: './historia-de-vida.component.html',
  styleUrl: './historia-de-vida.component.css'
})
export class HistoriaDeVidaComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();  // DataSource para la tabla
  displayedColumns: string[] = ['diagnosis', 'medicines', 'treatment_days','description', 'date','animalId', 'accion'];
  healthHistoryForm!: FormGroup;
  editMode: boolean = false;
  currentEditingIndex: number | null = null; // Índice para el registro actual que se está editando

  constructor(  private dialog: MatDialogRef<HistoriaDeVidaComponent>,  // Referencia al diálogo
    private fb: FormBuilder) {}

  ngOnInit() {
    this.healthHistoryForm = this.fb.group({
      diagnosis: ['', Validators.required],
      medicines: ['', Validators.required],
      treatment_days: [0, Validators.required],
      description: [''],
      date: ['', Validators.required],
    });

    // Simulación de algunos datos iniciales para la tabla
    this.dataSource.data = [
      { diagnosis: 'Gripe', medicines: 'Ibuprofeno', treatment_days: 5, date: '2024-09-01' },
      { diagnosis: 'Fractura', medicines: 'Paracetamol', treatment_days: 14, date: '2024-09-10' }
    ];
  }

  abrirModal() {
    const dialogRef = this.dialog.open(HistoriaDeVidaComponent, {
      width: '400px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Lógica para guardar el nuevo historial aquí
        this.guardarHistorial(result);
      }
    });
  }

  guardarHistorial(data: any) {
    if (this.editMode && this.currentEditingIndex !== null) {
      // Si estamos editando un registro
      this.dataSource.data[this.currentEditingIndex] = data;
      this.editMode = false;
      this.currentEditingIndex = null;
    } else {
      // Si estamos creando un nuevo registro
      this.dataSource.data = [...this.dataSource.data, data];
    }
  }

  onSubmit() {
    if (this.healthHistoryForm.valid) {
      this.dialog.close(this.healthHistoryForm.value);
    }
  }

  editar(element: any, index: number) {
    // Activar el modo edición y cargar el historial en el formulario
    this.editMode = true;
    this.currentEditingIndex = index;
    this.healthHistoryForm.setValue({
      diagnosis: element.diagnosis,
      medicines: element.medicines,
      treatment_days: element.treatment_days,
      description: element.description || '',
      date: element.date
    });
    
    // Abrir el modal con el formulario pre-rellenado
    this.abrirModal();
  }

  eliminar(index: number) {
    // Eliminar el historial seleccionado
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription(); // Notificar a la tabla de los cambios
  }

  aplicarFiltro(event: Event) {
    const filtroValor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtroValor.trim().toLowerCase();
  }

}
