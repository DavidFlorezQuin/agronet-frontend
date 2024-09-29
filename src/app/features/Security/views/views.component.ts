import { Component, OnInit } from '@angular/core';
import { ViewService } from './views.service';
import { View } from './view.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { Modulo } from '../modules/modulo.module';
import { AlertService } from '../../../shared/components/alert.service';
import { ModuleService } from '../modules/module.service';
import { NgForm } from '@angular/forms';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-views',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTablesModule,CommonModule,FormsModule,
    MatIconModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './views.component.html',
  styles: ``
})
export class ViewsComponent implements OnInit {
  views: View[] = [];
  modulos!: Modulo[];

  newView: View = { id: 0, name: '', description: '', route: '', moduleId: 0 };
  displayedColumns: string[] = ['id', 'name', 'description', 'route', 'moduloId', 'acciones'];
  dataSource!: MatTableDataSource<View>;
  dtoptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private viewService: ViewService, private alertService: AlertService,private moduleService: ModuleService,) {}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      lengthMenu: [5, 10, 15, 20]
    };
    this.listViews();
    this.loadModules();
  }

  resetForm(): void {
    this.newView = { id: 0, name: '', description: '', route: '', moduleId: 0 };
  }

  listViews(): void {
    this.viewService.getViews().subscribe({
      next: (res: View[]) => {

        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.views = res;
        
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }
  loadModules(): void {
    this.moduleService.getModules().subscribe({
      next: (modulos: Modulo[]) => {
        this.modulos = modulos;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al cargar los módulos');
      }
    });
  }
  onEdit(view: View): void {
    this.newView = { ...view };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.viewService.deleteViews(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listViews();
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
      if (this.newView.id > 0) {
        this.viewService.updateViews(this.newView, this.newView.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newView = { id: 0, name: '', description: '', route: '', moduleId: 0 };
            this.listViews();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.viewService.createViews(this.newView).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listViews();
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
