
import { ModuleService } from './module.service';
import { Modulo } from './modulo.module';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { AlertService } from '../../../shared/components/alert.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// Asegúrate de crear este servicio
// Cambia la ruta según tu estructura
// Define tu interfaz 'Modulo'
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTablesModule,CommonModule,FormsModule,
    MatIconModule,
   
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './modules.component.html',
  styles: ``
})
export class ModulesComponent implements OnInit {
  newModulo: Modulo = { id: 0, name: '', description: '', orders: 0 };
  displayedColumns: string[] = ['id', 'name', 'description', 'orders', 'acciones'];
  dataSource!: MatTableDataSource<Modulo>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private moduloService: ModuleService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.listModulos();
  }

  listModulos(): void {
    this.moduloService.getModules().subscribe({
      next: (res: Modulo[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(modulo: Modulo): void {
    this.newModulo = { ...modulo };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.moduloService.deleteModules(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listModulos();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newModulo.id > 0) {
        this.moduloService.updateModules(this.newModulo, this.newModulo.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newModulo = { id: 0, name: '', description: '', orders: 0 };
            this.listModulos();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.moduloService.createModules(this.newModulo).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listModulos();
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

