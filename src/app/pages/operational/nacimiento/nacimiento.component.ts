
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { NacimetoService } from './nacimiento.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Nacimiento } from './nacimiento.module';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Config } from 'datatables.net';
import { FormsModule } from '@angular/forms';
import { error } from 'jquery';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import { InseminationService } from '../inseminacion/inseminacion.service';
import { Insemination } from '../inseminacion/Insemination.module';
import { Animal } from '../animal/animal.module';

@Component({
  selector: 'app-nacimiento',
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
  templateUrl: './nacimiento.component.html',
  styleUrl: './nacimiento.component.css'
})
export class NacimientoComponent implements OnInit {
  IdFarm: number | null = null; 
  bulls: Animal[] = [];
  inseminations: Insemination[] = [];
  nacimiento: Nacimiento[] = [];
  newNacimiento: Nacimiento = {
    id: 0,
    assistence: '', Result: 0,
    Description: '',
    BirthWeight: 0,
    Inseminacionid: '', AnimalId: 0,


  };
  displayedColumns: string[] = ['id', 'Assistence', 'Result', 'Description', 'BirthWeight', 'Inseminacionid', 'AnimalId'];

  dataSource: MatTableDataSource<Nacimiento> = new MatTableDataSource<Nacimiento>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private nacimientoService: NacimetoService, private alertaService: AlertService, private inseminationService:InseminationService) { }

  ngOnInit(): void {
    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); // Convertir a number
    } else {
      console.error('ID de la finca no válido o no presente en localStorage');
      this.IdFarm = null; // Si no hay ID, establecer a null
    }

    if (this.IdFarm !== null) {
      this.ListNacimiento(this.IdFarm);
      this.listInseminations(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
  }

  validateBirthWeight(): boolean {
    return typeof this.newNacimiento.BirthWeight === 'number' && this.newNacimiento.BirthWeight >= 0;
}

  listInseminations(IdFarm:number): void {
    this.inseminationService.getInseminations(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;

        this.inseminations = data;
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los datos');
      }
    });
  }


  ListNacimiento(IdFarm: number): void {
    this.nacimientoService.getNacimiento(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.data = data;
        this.nacimiento = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
    error: () => {
      this.alertaService.ErrorAlert('Error al obtener los datos de nacimiento')
    }
  }

  downloadPDF() {

  }

  aplicarFiltro(event: Event): void {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onEdit(nacimiento: Nacimiento): void {
    this.newNacimiento = { ...nacimiento };
  }
  /**
   * Handles the editing of a nacimiento object.
   *
   * This function takes a Nacimiento object as a parameter and copies its properties to the newNacimiento object.
   * This allows for editing the nacimiento object in the component's UI.
   *
   * @param nacimiento - The Nacimiento object to be edited.
   * @returns {void} - This function does not return any value.
   */

  eliminar(id: number): void {
    this.alertaService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.nacimientoService.deleteNacimiento(id).subscribe({
          next: (res) => {
            this.alertaService.SuccessAlert('Eliminado con éxito');
            if (this.IdFarm !== null) {
              this.ListNacimiento(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }          },
          error: () => {
            this.alertaService.ErrorAlert('Error al eliminar el animal');
          }
        });
      }
    });
  }

  editar(form: NgForm): void {
    if (form.valid) {
      if (this.newNacimiento.id > 0) {
        this.nacimientoService.updateNacimiento(this.newNacimiento, this.newNacimiento.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado con éxito');
            form.reset();
            this.ListNacimiento;
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar el animal');
          }
        });
      }
    } else {
      this.alertaService.ErrorAlert('Por favor, complete los datos requeridos');
    }

  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newNacimiento.id > 0) {
        this.nacimientoService.updateNacimiento(this.newNacimiento, this.newNacimiento.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newNacimiento = {
              id: 0,
              assistence: '', Result: 0,
              Description: '',
              BirthWeight: 0,
              Inseminacionid: '', AnimalId: 0,

            }
            if (this.IdFarm !== null) {
              this.ListNacimiento(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }                },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.nacimientoService.createNacimiento(this.newNacimiento).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Creado correctamente');
            form.reset();
            this.ListNacimiento;
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al crear');

          }
        });
      }
    } else {
      this.alertaService.ErrorAlert('Por favor completa todod los campos');

    }
  }
  checkValidSelection(selectControl: any): void {
    if (selectControl.invalid && selectControl.touched) {
      console.error('Selección no válida');

      if (selectControl.value === '') {
        selectControl.control.setErrors({ required: true });
      } else {
        selectControl.control.setErrors(null);
      }
      selectControl.control.markAsTouched(); 
    }
  }
  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-') {
        event.preventDefault(); // Prevenir la entrada del símbolo de menos
    }
  }
}
