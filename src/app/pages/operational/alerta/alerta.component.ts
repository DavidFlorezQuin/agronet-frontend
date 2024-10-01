import { FormsModule, NgForm } from '@angular/forms';

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
import { Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { Alerta } from './alerta.module';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { AlertaService } from './alerta.service';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-alerta',
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
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.css'
})
export class AlertaComponent implements OnInit{
  alerta: Alerta[] = [];


  newAlerta: Alerta = { id: 0, Name: '', Description: '', Date: new Date , IsRead: new Boolean, AnimalId:0, CategoryAlertId:0,UsersId:0 };

  displayedColumns: string[] = ['id', 'Name', 'Description', 'Date', 'IsRead','AnimalId','CategoryAlertId','UsersId', 'acciones'];
  dataSource!: MatTableDataSource<Alerta>;
  dtoptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private AlertaService: AlertaService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      lengthMenu: [5, 10, 15, 20]
    };
    this.listAlerta();

  }



  listAlerta(): void {
    this.AlertaService.getAlerta().subscribe({
      next: (res: Alerta[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.alerta = res;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(alerta: Alerta): void {
    this.newAlerta = { ...alerta };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.AlertaService.deleteAlerta(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listAlerta();
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
      if (this.newAlerta.id > 0) {
        this.AlertaService.updateAlerta(this.newAlerta, this.newAlerta.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newAlerta = { id: 0, Name: '', Description: '', Date: new Date , IsRead: new Boolean, AnimalId:0, CategoryAlertId:0,UsersId:0};
            this.listAlerta();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.AlertaService.createAlerta(this.newAlerta).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listAlerta();
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
