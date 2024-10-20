import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { CategoryDisiesesService } from './categoria-enfermedad.service'; 
import { CategoryDisieses } from './categoria-enfermedad.module'; 
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
import { DataTablesModule } from 'angular-datatables';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-categoria-enfermedad',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    DataTablesModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
   ],
  templateUrl: './categoria-enfermedad.component.html',
  styleUrl: './categoria-enfermedad.component.css'
})
export class CategoriaEnfermedadComponent implements OnInit{

  categoryDisieses: CategoryDisieses[] = [];
  newCategory: CategoryDisieses = { id: 0, name: '', description: '' };
  displayedColumns: string[] = ['name', 'description', 'acciones'];
  dataSource!: MatTableDataSource<CategoryDisieses>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(
    private categoryDisiesesService: CategoryDisiesesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.listCategoryDisieses();
  }

  listCategoryDisieses(): void {
    this.categoryDisiesesService.getCategoryDisieses().subscribe({
      next: (res: any) => {
        const data = res.data
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = data; 
        this.categoryDisieses = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener las categorías');
      }
    });
  }

  onEdit(category: CategoryDisieses): void {
    this.newCategory = { ...category };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.categoryDisiesesService.deleteCategoryDisieses(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listCategoryDisieses();
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
      if (this.newCategory.id > 0) {
        this.categoryDisiesesService
          .updateCategoryDisieses(this.newCategory, this.newCategory.id)
          .subscribe({
            next: () => {
              this.alertService.SuccessAlert('Actualizado correctamente');
              form.resetForm();
              this.newCategory = { id: 0, name: '', description: '' };
              this.listCategoryDisieses();
              this.closeModal();
            },
            error: () => {
              this.alertService.ErrorAlert('Error al actualizar');
            }
          });
      } else {
        this.categoryDisiesesService.createCategoryDisieses(this.newCategory).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.resetForm();
            this.newCategory = { id: 0, name: '', description: '' };
            this.listCategoryDisieses();
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