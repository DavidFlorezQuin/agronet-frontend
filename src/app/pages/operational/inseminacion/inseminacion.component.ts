import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, NgForm } from '@angular/forms';
import { InseminationService } from './inseminacion.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Insemination } from './Insemination.module';
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-insemination',
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
  templateUrl: './inseminacion.component.html',
  styles: []
})
export class InseminationComponent implements OnInit {
  dataSource: MatTableDataSource<Insemination> = new MatTableDataSource<Insemination>();
  displayedColumns:string[] = ['id', 'description', 'semenId', 'motherId', 'result' ,'inseminationType', 'acciones'];
  inseminations: Insemination[] = [];
 
  newInsemination: Insemination = {
    id: 0, 
    description: '',
    semenId: 0,
    motherId: 0,
    result: '',
    inseminationType: ''
  };

  constructor(private inseminationService: InseminationService, private alertService: AlertService) {}

  ngOnInit(): void {

    this.listInseminations();
  }

  listInseminations(): void {
    this.inseminationService.getInseminations().subscribe({
      next: (res) => {
        this.inseminations = res;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(insemination: Insemination): void {
    this.newInsemination = { ...insemination };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.inseminationService.deleteInsemination(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listInseminations();
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
      if (this.newInsemination.id > 0) {
        this.inseminationService.updateInsemination(this.newInsemination, this.newInsemination.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.listInseminations();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.inseminationService.createInsemination(this.newInsemination).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.newInsemination={ id: 0, description: '',
              semenId: 0,
              motherId: 0,
              result: '',
              inseminationType: ''};
            this.listInseminations();
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

  aplicarFiltro(event:Event): void{

    const filterValue=(event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    }
}
