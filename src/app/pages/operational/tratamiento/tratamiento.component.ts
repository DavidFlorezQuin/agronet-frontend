import { Treatments } from './tratamiento.module';

import { TreatmentsService } from './tratamiento.service';
import { AlertService } from '../../../shared/components/alert.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';
import { AnimalDiagnosticsService } from '../animal-diagnostico/animal-diagnostico.service';
import { AnimalDiagnostics } from '../animal-diagnostico/AnimalDiagnostics.module';


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
  templateUrl: './tratamiento.component.html'
})
export class TratamientoComponent implements OnInit {
  minDate: string = new Date().toISOString().split('T')[0];
  IdFarm: number | null = null;
  diagnostics: AnimalDiagnostics[] = [];
  tratamiento: Treatments[] = [];
  newTratamiento: Treatments = {
    id: 0,
    name:'',
    description: '',
    finishiedDate: new Date(this.minDate),
    startDate: new Date(this.minDate),
    animalDiagnosticsId: 0
  }

  displayedColumns: string[] = ['id', 'diagnostico', 'description', 'finishiedDate', 'startDate', 'state', 'acciones'];


  dataSource!: MatTableDataSource<Treatments>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private treatmentsService: TreatmentsService, private alertService: AlertService, private animalDiagnosticService: AnimalDiagnosticsService) { }
  ngOnInit(): void {

    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); 
    } else {
      this.IdFarm = null; 
    }

    if (this.IdFarm !== null) {
      this.listTratamiento(this.IdFarm);
      this.listDiagnostics(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
    this.setDefaultSelections();
  }
  setDefaultSelections(): void {
    // Si hay toros disponibles, seleccionar el primero como valor predeterminado
    if (this.diagnostics.length > 0) {
      this.newTratamiento.animalDiagnosticsId = this.diagnostics[0].id;
    }
    
  }
  checkValidSelection(diagnostico: NgModel) {
    console.log('Valor seleccionado:', this.newTratamiento.animalDiagnosticsId);
    if (diagnostico.invalid && diagnostico.touched) {
      console.error('Selección inválida');
    } else {
      console.log('Selección válida');
    } // Asegurarse de marcar el campo como tocado
  }
  listDiagnostics(IdFarm: number): void {
    this.animalDiagnosticService.getAnimalDiagnostics(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.diagnostics = data;
        this.setDefaultSelections();
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los diagnósticos');
      }
    });
  }

  listTratamiento(IdFarm: number): void {
    this.treatmentsService.getTreatments(IdFarm).subscribe({
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

  downloadPDF() {

  }

  onEdit(tratamiento: Treatments): void {
    this.newTratamiento = {
      ...tratamiento,
      // Asegúrate de que las fechas se mantengan como instancias de Date
      startDate: new Date(tratamiento.startDate), // Asegúrate de que sea un objeto Date
      finishiedDate: new Date(tratamiento.finishiedDate) // Asegúrate de que sea un objeto Date
    };
  }
  
  
  eliminar(id: number): void {
    // Mostrar un mensaje de confirmación antes de eliminar
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        // Llamar al servicio para eliminar el tratamiento
        this.treatmentsService.deleteTreatment(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            // Verificar si el ID de la finca es válido para listar los tratamientos actualizados
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);  // Refrescar la lista de tratamientos después de eliminar
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
          },
          error: (err) => {
            // Manejar errores y mostrar un mensaje en caso de fallo
            console.error('Error al eliminar el tratamiento: ', err);
            this.alertService.ErrorAlert('Error al eliminar el tratamiento');
          }
        });
      }
    });
  }
  

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.newTratamiento.startDate = new Date(this.newTratamiento.startDate);
      this.newTratamiento.finishiedDate = new Date(this.newTratamiento.finishiedDate);
  

      if (this.newTratamiento.id > 0) {
        this.treatmentsService.updateTreatment(this.newTratamiento, this.newTratamiento.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            } 
            form.reset(); 
            this.resetTratamiento(); 
            console.log('Formulario válido: ', form.valid);

          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar el tratamiento');
          }
        })
      } else {
        this.treatmentsService.createTreatment(this.newTratamiento).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Agregado correctamente');
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            } 
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
  
  resetTratamiento(): void {
    this.newTratamiento = {
      id: 0,
      name: '',
      description: '',
      finishiedDate: new Date(this.minDate),  // Resetear con minDate
      startDate: new Date(this.minDate),  // Resetear con minDate
      animalDiagnosticsId: 0
    };
  }
  onDelete(id: number) {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.treatmentsService.deleteTreatment(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Registro eliminado correctamente');
            if (this.IdFarm !== null) {
              this.listDiagnostics(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }          },
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
