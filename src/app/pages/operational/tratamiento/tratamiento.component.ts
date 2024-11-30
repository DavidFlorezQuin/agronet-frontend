import { Treatments } from './tratamiento.module';

import { TreatmentsService } from './tratamiento.service';
import { AlertService } from '../../../shared/components/alert.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';
import { AnimalDiagnosticsService } from '../animal-diagnostico/animal-diagnostico.service';
import { AnimalDiagnostics } from '../animal-diagnostico/AnimalDiagnostics.module';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-tratamiento',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    DataTablesModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './tratamiento.component.html'
})
export class TratamientoComponent implements OnInit {
  minDate: string = new Date().toISOString().split('T')[0];
  IdFarm: number | null = null;
  diagnostics: AnimalDiagnostics[] = [];
  tratamiento: Treatments[] = [];
  newTratamiento: Treatments = {
    id: 0,
    name: '',
    state: false,
    description: '',
    finishiedDate: new Date(),
    startDate: new Date(),
    animalDiagnosticsId: 0
  }

  displayedColumns: string[] = ['id', 'diagnostico', 'description', 'finishiedDate', 'startDate', 'state', 'acciones'];


  dataSource!: MatTableDataSource<Treatments>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(private treatmentsService: TreatmentsService, private alertService: AlertService, private animalDiagnosticService: AnimalDiagnosticsService) { }
  ngOnInit(): void {

    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString);
    } else {
      this.IdFarm = null;
    }

    if (this.IdFarm !== null) {
      this.listTratamiento(this.IdFarm);
      this.listDiagnostics(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
  }

  listDiagnostics(IdFarm: number): void {
    this.animalDiagnosticService.getAnimalDiagnostics(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.diagnostics = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los diagnósticos');
      }
    });
  }

  listTratamiento(IdFarm: number): void {
    this.treatmentsService.getTreatments(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.tratamiento = data;
        this.dataSource.data = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los tratamientos');
      }
    })
  }

  downloadPDF() {

  }

  onEdit(tratamiento: Treatments) {
    this.newTratamiento = { ...tratamiento };

    if (this.newTratamiento.startDate) {
      const dateObj = new Date(this.newTratamiento.startDate);
      this.newTratamiento.startDate = dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }
    if (this.newTratamiento.finishiedDate) {
      const dateObj = new Date(this.newTratamiento.finishiedDate);
      this.newTratamiento.finishiedDate = dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }

  }

  eliminar(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.treatmentsService.deleteTreatment(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar el tratamiento');
          }
        })
      }
    })

  }

  resetForm() {
    this.newTratamiento = {
      id: 0,
      name: '',
      state: false,
      description: '',
      finishiedDate: new Date(),
      startDate: new Date(),
      animalDiagnosticsId: 0
    };
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
      if (this.newTratamiento.id > 0) {
        const formData = form.value;
        const Data: Treatments = {
          ...formData,
          id: this.newTratamiento.id,
          description: this.newTratamiento.description,
          finishiedDate: this.newTratamiento.finishiedDate,
          startDate: this.newTratamiento.startDate,
          animalDiagnosticsId: this.newTratamiento.animalDiagnosticsId,
          name: this.newTratamiento.name,
          state: this.newTratamiento.state  // Usando el valor vinculado
        }

        this.treatmentsService.updateTreatment(Data, this.newTratamiento.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);
              
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
            this.closeModal();
            this.resetForm();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar el tratamiento');
          }
        })
      } else {
        const formData = form.value; 
        const tratamiento: Treatments = {
          ...formData,
          Result: 'EN PROCESO'
        }
        this.treatmentsService.createTreatment(tratamiento).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Agregado correctamente');
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);
              
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            } 
            form.reset();
            this.closeModal();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al agregar el tratamiento');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Formulario incompleto');
    }
  }

  onDelete(id: number):void{
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.treatmentsService.deleteTreatment(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Producción eliminada correctamente');
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar producción');
          }
        });
      }
    });
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

}
