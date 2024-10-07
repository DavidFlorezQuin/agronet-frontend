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
  templateUrl: './tratamiento.component.html'})
export class TratamientoComponent implements OnInit {

  tratamiento: Treatments[] = [];
  newTratamiento: Treatments = {
    id: 0,
    description: '',
    finishiedDate: new Date(),
    startDate: new Date(),
    animalDiagnosticsId: 0
  }

  displayedColumns: string[] = ['id', 'description', 'finishiedDate', 'startDate', 'animalDiagnosticsId'];


  dataSource!: MatTableDataSource<Treatments>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private treatmentsService: TreatmentsService, private alertService: AlertService) { }
  ngOnInit(): void {

    this.listTratamiento();

  }

  listTratamiento(): void {
    this.treatmentsService.getTreatments().subscribe({
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

  downloadPDF(){
    
  }

  eliminar(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.treatmentsService.deleteTreatment(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listTratamiento();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar el tratamiento');
          }
        })
      }
    })

  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newTratamiento.id > 0) {
        this.treatmentsService.updateTreatment(this.newTratamiento, this.newTratamiento.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.listTratamiento();
            this.newTratamiento = {
              id: 0,
              description: '',
              finishiedDate: new Date(),
              startDate: new Date(),
              animalDiagnosticsId: 0
            };
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar el tratamiento');
          }
        })
      } else {
        this.treatmentsService.createTreatment(this.newTratamiento).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Agregado correctamente');
            this.listTratamiento();
            form.reset();
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

  onDelete(id:number){

  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

}
