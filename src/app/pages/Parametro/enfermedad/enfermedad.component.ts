import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { DiseasesService } from './enfermedad.service';
import { Diseases } from './enfermedad.module';
import { AlertService } from '../../../shared/components/alert.service';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryDisiesesService } from '../categoria-enfermedad/categoria-enfermedad.service';  // Importar servicio de categorías
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-enfermedad',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './enfermedad.component.html'
})
export class EnfermedadComponent implements OnInit {
  diseases: Diseases[] = [];
  categories: any[] = []; // Array para almacenar las categorías
  newDisease: Diseases = { id: 0, name: '', description: '', categoryDisiesesId: 0, categoryDisieses: 0 };
  displayedColumns: string[] = ['id', 'name', 'description', 'category', 'actions'];
  dataSource!: MatTableDataSource<Diseases>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(
    private diseasesService: DiseasesService,
    private alertService: AlertService,
    private categoryDisiesesService: CategoryDisiesesService // Inyectar el servicio de categorías
  ) { }

  ngOnInit(): void {
    this.listDiseases();
    // this.listCategories(); // Obtener las categorías al iniciar el componente
  }

  listDiseases(): void {
    this.diseasesService.getDiseases().subscribe({
      next: (res: any) => {
        const data = res.data; 
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = data; 
        this.diseases = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener las enfermedades');
      }
    });
  }
  onEdit(disease: Diseases): void {
    this.newDisease = { ...disease };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.diseasesService.deleteDisease(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listDiseases();
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
  const modal = new bootstrap.Modal(this.Modal.nativeElement);  // Usar la referencia del modal
  modal.hide();  // Cerrar el modal
}
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newDisease.id > 0) {
        this.diseasesService
          .updateDisease(this.newDisease, this.newDisease.id)
          .subscribe({
            next: () => {
              this.alertService.SuccessAlert('Actualizado correctamente');
              form.resetForm();
              this.newDisease = { id: 0, name: '', description: '', categoryDisiesesId: 0, categoryDisieses: 0 };
              this.listDiseases();
              this.closeModal();
            },
            error: () => {
              this.alertService.ErrorAlert('Error al actualizar');
            }
          });
      } else {
        this.diseasesService.createDisease(this.newDisease).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.resetForm();
            this.newDisease = { id: 0, name: '', description: '', categoryDisiesesId: 0, categoryDisieses: 0 };
            this.listDiseases();
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
