import { Component, OnInit, ViewChild } from '@angular/core';
import { VaccineAnimalsService } from './vacunacion.service';
import { AlertService } from '../../../shared/components/alert.service';
import { VaccineAnimals } from './vacunacion.module';
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
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';

import { Animal } from '../animal/animal.module';
import { Vaccines } from '../../Parametro/vacuna/vacuna.module';
import { NgModule } from '@angular/core';
import { VaccinesService } from '../../Parametro/vacuna/vacuna.service';
import { AnimalService } from '../animal/animal.service';
import { state } from '@angular/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-vacunacion',
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
   MatSortModule,
   MatSelectModule,
   MatDatepickerModule,  // Asegúrate de incluir este módulo
    MatNativeDateModule,
  ],
  templateUrl: './vacunacion-animal.component.html'})
export class VacunacionComponent implements OnInit {
  newVaccineAnimal: VaccineAnimals = {
    id: 0,
    animalId: 0,
    vaccineId: 0,
    nextDose: new Date(),
  };
  displayedColumns: string[] = ['id', 'animalId', 'vaccineId','nextDose','acciones'];

  vacuna: Vaccines [] = [];
animal: Animal [] = [];

  vaccineAnimals: VaccineAnimals[] = [];

dataSource!: MatTableDataSource<VaccineAnimals>;
// referenicas del paginador y sort
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
  constructor(private vaccineAnimalsService: VaccineAnimalsService,
     private alertService: AlertService
    , private animalService:AnimalService, private vaccinesService:VaccinesService) {}

  ngOnInit(): void {

    this.listVaccineAnimals();
    this.loadAnimal();
  }

  listVaccineAnimals(): void {
    this.vaccineAnimalsService.getVaccineAnimals().subscribe({
      next: (data: VaccineAnimals[]) => {
        
        this.dataSource=new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.vaccineAnimals = data;
        this.dataSource.data = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los registros de vacunas');
      }
    });
  }

  loadAnimal(): void {
    this.animalService.getAnimals().subscribe({
      next: (Animales: Animal[]) => {
        this.animal=Animales;
      },
      error: (error)=>{
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar ');
      }
    });  
  
  }

  loadVacuna(): void {
    this.vaccinesService.getVaccines().subscribe({
      next: (Vacuna: Vaccines[]) => {
        this.vacuna=Vacuna;
      },
      error: (error)=>{
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar ');
      }
    });  
  
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newVaccineAnimal.id > 0) {
        this.vaccineAnimalsService.updateVaccineAnimal(this.newVaccineAnimal, this.newVaccineAnimal.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Vacuna actualizada correctamente');
            form.reset();
            this.listVaccineAnimals();
            this.newVaccineAnimal={ id: 0,
              animalId: 0,
              vaccineId: 0,
              nextDose: new Date(),};
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar la vacuna');
          }
        });
      } else {
        this.vaccineAnimalsService.createVaccineAnimal(this.newVaccineAnimal).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Vacuna registrada correctamente');
            form.reset();
            this.listVaccineAnimals();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al registrar la vacuna');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onEdit(vaccineAnimal: VaccineAnimals): void {
    this.newVaccineAnimal = { ...vaccineAnimal };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.vaccineAnimalsService.deleteVaccineAnimal(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Registro eliminado correctamente');
            this.listVaccineAnimals();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar el registro');
          }
        });
      }
    });
  }

aplicarFiltro(event:Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if(this.dataSource.paginator){
    this.dataSource.paginator.firstPage();
  }
}

}
