import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { AlertService } from '../../../shared/components/alert.service';
import { CategoriaAlertaaService } from './categoria-alerta.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaAlerta } from './categoria-alerta.module';
import { MatButtonModule } from '@angular/material/button';
import { DataTablesModule } from 'angular-datatables';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-categoria-alerta',
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
    MatSortModule
  ],
  templateUrl: './categoria-alerta.component.html'
})
export class CategoriaAlertaComponent implements OnInit {
  newCategoryaAlerta: CategoriaAlerta = { id: 0, name: '', Description: '', Color: '' }
  displayedColumns: string[] = ['id', 'name', 'Description', 'color', 'Acciones']
  CategoriaAlerta: CategoriaAlerta[] = [];
  dataSource!: MatTableDataSource<CategoriaAlerta>;

  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(private alertService: AlertService, private CategoriaAlertaaService: CategoriaAlertaaService) { }
  ngOnInit(): void {

    this.listCategoriaAlerta();
  }
  listCategoriaAlerta(): void {
    this.CategoriaAlertaaService.getCategoriaAlerta().subscribe({
      next: (res: any) => {

        const data = res.data; 

        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.CategoriaAlerta = data;
        this.dataSource.data = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(CategoriaAlerta: CategoriaAlerta): void {
    this.newCategoryaAlerta = { ...CategoriaAlerta };


  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.CategoriaAlertaaService.deleteCategoriaAlerta(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listCategoriaAlerta();
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
      if (this.newCategoryaAlerta.id > 0) {
        this.CategoriaAlertaaService.updateCategoriaAlerta(this.newCategoryaAlerta, this.newCategoryaAlerta.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newCategoryaAlerta = { id: 0, name: '', Description: '', Color: '' };
            this.listCategoriaAlerta();
            this.closeModal();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.CategoriaAlertaaService.createCategoriaAlerta(this.newCategoryaAlerta).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listCategoriaAlerta();
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

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
