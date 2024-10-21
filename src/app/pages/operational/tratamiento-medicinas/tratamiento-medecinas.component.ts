import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { TreatmentsMedicines } from './tratamiento-medecinas.module';
import { TreatmentsMedicinesService } from './tratamiento-medecinas.service';
import { AlertService } from '../../../shared/components/alert.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { Treatments } from '../tratamiento/tratamiento.module';
import { TreatmentsService } from '../tratamiento/tratamiento.service';
import { Medicina } from '../../Parametro/medicina/medicina.component.module';
import { MedicinaService } from '../../Parametro/medicina/medicina.service';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-tratamiento-medecinas',
  standalone: true,
  imports: [CommonModule, FormsModule,
    MatIconModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './tratamiento-medecinas.component.html'
})
export class TratamientoMedecinasComponent implements OnInit {
  IdFarm: number | null = null; 
  medicines: Medicina[] = []; 
  treatmentsMedicines: TreatmentsMedicines[] = [];
  tratamientos: Treatments[] = []; 

  newTreatmentMedicine: TreatmentsMedicines = { id: 0, name: '', description: '', periocityDay: 0, medicinesId: 0, treatmentId: 0 };
  displayedColumns: string[] = ['id','description', 'periocityDay', 'medicines', 'treatment', 'actions'];
  dataSource!: MatTableDataSource<TreatmentsMedicines>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(private treatmentMedicineService: TreatmentsMedicinesService, private alertService: AlertService, private treatmentService: TreatmentsService, private medicinesService:MedicinaService) { }

  ngOnInit(): void {

    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); // Convertir a number
    } else {
      this.IdFarm = null; // Si no hay ID, establecer a null
    }

    if (this.IdFarm !== null) {
      this.getTreatmentsMedicines(this.IdFarm);
      this.listTratamiento(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }

    this.listMedicinas();

  }
  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-') {
        event.preventDefault(); // Prevenir la entrada del símbolo de menos
    }
  }
  getTreatmentsMedicines(IdFarm:number): void {
    this.treatmentMedicineService.getAllTreatmentsMedicinesService(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data; 
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.treatmentsMedicines = data; 
        this.dataSource.data = data; 
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(treatmentMedicine: TreatmentsMedicines): void {
    this.newTreatmentMedicine = { ...treatmentMedicine };
  }

  downloadPDF(){
    
  }

  listTratamiento(IdFarm: number): void {
    this.treatmentService.getTreatments(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.tratamientos = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los tratamientos');
      }
    })
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then(res => {
      if (res.isConfirmed) {
        this.treatmentMedicineService.deleteTreatmentsMedicinesService(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            if (this.IdFarm !== null) {
              this.getTreatmentsMedicines(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }
// Función para cerrar el modal

closeModal(): void {
  const modalElement = document.getElementById('treatmentsModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide(); // Cierra el modal
    modalElement.classList.remove('show');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = ''; // Restaurar el overflow del body

    // Eliminar cualquier 'modal-backdrop' que haya quedado
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove(); // Elimina la capa de fondo negra
    }
  } else {
    console.error('El modal no se encontró. Asegúrate de que el ID sea correcto.');
  }
}
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newTreatmentMedicine.id > 0) {
        this.treatmentMedicineService.updateTreatmentsMedicinesService(this.newTreatmentMedicine.treatmentId, this.newTreatmentMedicine).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            if (this.IdFarm !== null) {
              this.getTreatmentsMedicines(this.IdFarm);
              
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
            this.closeModal();
            form.resetForm();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.treatmentMedicineService.createTreatmentsMedicinesService(this.newTreatmentMedicine).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            if (this.IdFarm !== null) {
              this.getTreatmentsMedicines(this.IdFarm);
              
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
            this.closeModal();
            form.resetForm();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear');
          }
        });
      }
    }
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  listMedicinas(): void {
  
    this.medicinesService.getMedicina().subscribe({
      next: (res: any) => {
  
        const data = res.data;
        this.medicines = data; 
      },
      error: (error) => {
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
  }
}
