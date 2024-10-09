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
  templateUrl: './vacunacion-animal.component.html'
})
export class VacunacionComponent implements OnInit {

  IdFarm: number | null = null; // Propiedad para almacenar el ID


  newVaccineAnimal: VaccineAnimals = {
    id: 0,
    animalId: 0,
    vaccinesId: 0,
    dateApplied: new Date(),
    nextDose: null
  };
  displayedColumns: string[] = ['id', 'Animal', 'Vacuna', 'dateApplied', 'nextDose', 'acciones'];

  vacunas: Vaccines[] = [];
  animales: Animal[] = [];

  vaccineAnimals: VaccineAnimals[] = [];

  dataSource!: MatTableDataSource<VaccineAnimals>;
  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private vaccineAnimalsService: VaccineAnimalsService,
    private alertService: AlertService
    , private animalService: AnimalService, private vaccinesService: VaccinesService) { }

  ngOnInit(): void {

    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); // Convertir a number
    } else {
      console.error('ID de la finca no válido o no presente en localStorage');
      this.IdFarm = null; // Si no hay ID, establecer a null
    }

    if (this.IdFarm !== null) {
      this.listVaccineAnimals(this.IdFarm);
      this.ListAnimal(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
    this.loadVacuna();
  }

  downloadPDF() {

  }
  listVaccineAnimals(IdFarm: number): void {
    this.vaccineAnimalsService.getVaccineAnimals(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
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

  // loadAnimal(): void {
  //   this.animalService.getAnimals().subscribe({
  //     next: (Animales: Animal[]) => {
  //       this.animal = Animales;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //       this.alertService.ErrorAlert('Error al cargar ');
  //     }
  //   });

  // }
  ListAnimal(farmId: number): void {
    this.animalService.getAnimals(farmId).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.animales = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los animales');
      }
    });
  }

  loadVacuna(): void {
    this.vaccinesService.getVaccines().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.vacunas = data;
      },
      error: (error) => {
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
            if (this.IdFarm !== null) {
              this.listVaccineAnimals(this.IdFarm);
            }
            this.newVaccineAnimal = {
              id: 0,
              animalId: 0,
              vaccinesId: 0,
              dateApplied: new Date(),
              nextDose: null
            };
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
            if (this.IdFarm !== null) {
              this.listVaccineAnimals(this.IdFarm);
            }
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
            if (this.IdFarm !== null) {
              this.listVaccineAnimals(this.IdFarm);
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar el registro');
          }
        });
      }
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
