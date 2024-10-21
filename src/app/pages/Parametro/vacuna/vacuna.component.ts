import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { VaccinesService } from './vacuna.service'; 
import { Vaccines } from './vacuna.module'; 
import { AlertService } from '../../../shared/components/alert.service'; 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-vacuna',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './vacuna.component.html',
  styleUrl: './vacuna.component.css'
})
export class VacunaComponent implements OnInit {
  vaccines: Vaccines[] = [];
  newVaccine: Vaccines = { id: 0, name: '', description: '', dosesRequired: 0, refuerzoPeriod: 0, contraindications: '', typeVaccine: '' };
  displayedColumns: string[] = ['name', 'description', 'dosesRequired', 'refuerzoPeriod', 'contraindications', 'typeVaccine', 'actions'];
  dataSource!: MatTableDataSource<Vaccines>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(
    private vaccinesService: VaccinesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.listVaccines();
  }

  listVaccines(): void {
    this.vaccinesService.getVaccines().subscribe({
      next: (res: any) => {
        const data = res.data; 
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
        this.vaccines = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener las vacunas');
      }
    });
  }

  onEdit(vaccine: Vaccines): void {
    this.newVaccine = { ...vaccine };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.vaccinesService.deleteVaccine(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listVaccines();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }
// Función para cerrar el modal
closeModal(): void {
  const modalElement = document.getElementById('vaccineModal');
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
      if (this.newVaccine.id > 0) {
        this.vaccinesService
          .updateVaccine(this.newVaccine, this.newVaccine.id)
          .subscribe({
            next: () => {
              this.alertService.SuccessAlert('Actualizado correctamente');
              form.resetForm();
              this.newVaccine = { id: 0, name: '', description: '', dosesRequired: 0, refuerzoPeriod: 0, contraindications: '', typeVaccine: '' };
              this.listVaccines();
              this.closeModal();
            },
            error: () => {
              this.alertService.ErrorAlert('Error al actualizar');
            }
          });
      } else {
        this.vaccinesService.createVaccine(this.newVaccine).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.resetForm();
            this.newVaccine = { id: 0, name: '', description: '', dosesRequired: 0, refuerzoPeriod: 0, contraindications: '', typeVaccine: '' };
            this.listVaccines();
            this.closeModal();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
