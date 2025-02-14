import { Treatments } from './tratamiento.module';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
import { AnimalDiagnosticsService } from '../animal-diagnostico/animal-diagnostico.service';
import { AnimalDiagnostics } from '../animal-diagnostico/AnimalDiagnostics.module';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
import { Modal } from 'bootstrap';
import { TreatmentsMedicines } from '../tratamiento-medicinas/tratamiento-medecinas.module';
import { Medicina } from '../../Parametro/medicina/medicina.component.module';
import { TreatmentsMedicinesService } from '../tratamiento-medicinas/tratamiento-medecinas.service';
import { MedicinaService } from '../../Parametro/medicina/medicina.service';
import jsPDF from 'jspdf';

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
  medicines: TreatmentsMedicines[] = [];
  medicinesDrug: Medicina[]=[];

  newTratamiento: Treatments = {
    id: 0,
    name: '',
    state: false,
    description: '',
    finishiedDate: new Date(),
    startDate: new Date(),
    animalDiagnosticsId: 0
  }

  newTreatmentMedicine: TreatmentsMedicines = { 
    id: 0, 
    description: '', 
    periocity: '', 
    medicinesId: 0,
    medicines:'', 
    treatmentId: 0, 
    number:0 
  };

  displayedColumns: string[] = ['id', 'diagnostico', 'description', 'finishiedDate', 'startDate', 'state', 'acciones'];
  displayedColumnsMedicine: string[] = ['id', 'medicines', 'description', 'periocityDay', 'number', 'acciones'];

  dataSource!: MatTableDataSource<Treatments>;
  dataSourceMedicine!: MatTableDataSource<TreatmentsMedicines>;


  @ViewChild('table1Paginator', { static: true }) paginator1!: MatPaginator;
  @ViewChild('table2Paginator', { static: true }) paginator2!: MatPaginator;
  @ViewChild('table1Sort', { static: true }) sort1!: MatSort;
  @ViewChild('table2Sort', { static: true }) sort2!: MatSort

  constructor(private treatmentsService: TreatmentsService, private alertService: AlertService, private animalDiagnosticService: AnimalDiagnosticsService, private treatmentMedicineService: TreatmentsMedicinesService, private medicineService: MedicinaService) { }

  ngOnInit(): void {

    this.listMedicine()
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
  }

  listDiagnostics(IdFarm: number): void {
    this.animalDiagnosticService.getAnimalDiagnostics(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.diagnostics = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los diagnósticos');
      }
    });
  }
  
  listMedicine():void{
    this.medicineService.getMedicina().subscribe({
      next:(res:any) =>{
        const data = res.data; 
        this.medicinesDrug = data; 
      },
            error: () => {
        this.alertService.ErrorAlert('Error al obtener los diagnósticos');
      }
    })
  }

  isLoading: boolean = false;
  isData: boolean = false;
  listTratamiento(IdFarm: number): void {
    this.isLoading = true;
    this.treatmentsService.getTreatments(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator1;
        this.dataSource.sort = this.sort1;
        this.tratamiento = data;
        this.dataSource.data = data;
        this.isLoading = false; 
        this.isData = data.lenght === 0; 
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los tratamientos');
        this.isLoading = false; 
      }
    })
  }

  loadMedicine(IdTreatment: number):void{

    this.newTreatmentMedicine.treatmentId = IdTreatment
    
    this.treatmentMedicineService.getMedicineTreatments(IdTreatment).subscribe({
      next: (res: any) => {
        const info = res.data;
        this.dataSourceMedicine = new MatTableDataSource(info);
        this.dataSourceMedicine.paginator = this.paginator2;
        this.dataSourceMedicine.sort = this.sort2;
        this.medicines = info;
        this.dataSourceMedicine.data = info;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los medicamentos');
      }
    })
  }

  downloadPDF() {
        const doc = new jsPDF();
      
        // Título del PDF
        doc.setFontSize(16); // Tamaño de fuente para el título
        doc.setTextColor(22, 160, 133); // Cambiar el color del título
        doc.text('AGRONET', 14, 10); // Título del PDF
      
        // Agregar subtítulo debajo del título
        doc.setFontSize(10); // Tamaño de fuente para el subtítulo
        doc.setTextColor(0, 0, 0); // Color negro para el subtítulo
        doc.text('Sistema de gestión de ganadería colombiana', 14, 13); // Subtítulo
    
        doc.setFontSize(16); // Tamaño de fuente para el título
        doc.setTextColor(22, 160, 133); // Cambiar el color del título
        doc.text('Histórico de tratamientos', 14, 23); // Título del PDF
      
        // Encabezados de la tabla
        const headers = [['id', 'Diagnostico', 'Descripción','Fecha Inicio', 'Fecha final','Estado']];
      
        // Datos de la tabla
        const data = this.tratamiento.map(newDiagnostic => [
          newDiagnostic.id,
          newDiagnostic.name,
          newDiagnostic.animalDiagnostics,
          newDiagnostic.startDate,
          newDiagnostic.finishiedDate,
          newDiagnostic.state
        ]);
      
        // Generar tabla usando autoTable
        (doc as any).autoTable({
          head: headers,
          body: data,
          startY: 30, // Posición donde empieza la tabla
          theme: 'grid', // Estilo de la tabla
          headStyles: { fillColor: [56, 161, 15] }, // Estilo de encabezado
          styles: {
            fontSize: 10, // Tamaño de fuente en la tabla
            cellPadding: 2, // Espaciado dentro de las celdas
          },
          columnStyles: {
            0: { cellWidth: 10 },   
            1: { cellWidth: 20 },   
            2: { cellWidth: 40 },  
            3: { cellWidth: 20 },   
            4: { cellWidth: 20 },
            5: { cellWidth: 20 }
          }
        });
      
        // Guardar el archivo PDF
        doc.save('tratamientos.pdf');
  }
  downloadExcel(){
       // Crear un arreglo con los datos de los animales
          const bornlData = this.tratamiento.map(tratamiento => ({
            ID: tratamiento.id,
            Diagnóstico: tratamiento.name,
            Descripción: tratamiento.description,
            FechaInicio: tratamiento.startDate,
            FechaFin: tratamiento.finishiedDate,
            Estado: tratamiento.state
          }));
      
          // Crear un libro de trabajo (workbook) y una hoja (worksheet)
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(bornlData);
          const workbook: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'tratamiento');
      
          // Exportar el archivo Excel
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
          saveAs(blob, 'tratamiento.xlsx');
        }

  onEdit(tratamiento: Treatments) {
    this.newTratamiento = { ...tratamiento };

    if (this.newTratamiento.startDate) {
      const dateObj = new Date(this.newTratamiento.startDate);
      this.newTratamiento.startDate = dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }
    if (this.newTratamiento.finishiedDate) {
      const dateObj = new Date(this.newTratamiento.finishiedDate);
      this.newTratamiento.finishiedDate = dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }

  }

  eliminar(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.treatmentsService.deleteTreatment(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar el tratamiento');
          }
        })
      }
    })

  }

  onDeleteMedicine(id:number):void{
    this.treatmentMedicineService.deleteTreatmentsMedicinesService(id).subscribe({
      next: () => {
        this.alertService.SuccessAlert('Eliminado correctamente');
        this.loadMedicine(this.newTreatmentMedicine.treatmentId)
      }
    })
  }

  resetForm() {
    this.newTratamiento = {
      id: 0,
      name: '',
      state: false,
      description: '',
      finishiedDate: new Date(),
      startDate: new Date(),
      animalDiagnosticsId: 0
    };
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newTratamiento.id > 0) {
        const formData = form.value;
        const Data: Treatments = {
          ...formData,
          id: this.newTratamiento.id,
          description: this.newTratamiento.description,
          finishiedDate: this.newTratamiento.finishiedDate,
          startDate: this.newTratamiento.startDate,
          animalDiagnosticsId: this.newTratamiento.animalDiagnosticsId,
          name: this.newTratamiento.name,
          state: this.newTratamiento.state  // Usando el valor vinculado
        }

        this.treatmentsService.updateTreatment(Data, this.newTratamiento.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);

            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
            this.resetForm();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar el tratamiento');
          }
        })
      } else {
        const formData = form.value;
        const tratamiento: Treatments = {
          ...formData,
          Result: 'EN PROCESO',
          animalDiagnosticsId: this.newTratamiento.animalDiagnosticsId,
        }
        this.treatmentsService.createTreatment(tratamiento).subscribe({
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

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.treatmentsService.deleteTreatment(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Producción eliminada correctamente');
            if (this.IdFarm !== null) {
              this.listTratamiento(this.IdFarm);
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar producción');
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


  onSubmitMedicine(form:NgForm):void{

    const formData = form.value;
    const medicine: TreatmentsMedicines = {
      ...formData,
      medicinesId: this.newTreatmentMedicine.medicinesId,
      treatmentId: this.newTreatmentMedicine.treatmentId, 
      number: this.newTreatmentMedicine.number
    }
    this.treatmentMedicineService.createTreatmentsMedicinesService(medicine).subscribe({
      next:()=>{
        this.alertService.SuccessAlert('Agregado correctamente')
        this.loadMedicine(this.newTreatmentMedicine.treatmentId)
      }
    })
  }
}
