import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
import Swal from 'sweetalert2';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
import { Modal } from 'bootstrap';
import jsPDF from 'jspdf';
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
  inseminations: any[] = [];
  nacimiento: Nacimiento[] = [];
  newNacimiento: Nacimiento = {
    id: 0,
    assistence: 0,
    result: 0,
    description: '',
    birthWeight: 0,
    inseminationId: 0

  };
  displayedColumns: string[] = ['id', 'Assistence', 'Result', 'Description', 'BirthWeight', 'Inseminacionid', 'Fecha'];

  dataSource: MatTableDataSource<Nacimiento> = new MatTableDataSource<Nacimiento>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(private nacimientoService: NacimetoService, private alertaService: AlertService, private inseminationService: InseminationService) { }

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
    return typeof this.newNacimiento.birthWeight === 'number' && this.newNacimiento.birthWeight >= 0;
  }

  listInseminations(IdFarm: number): void {
    this.inseminationService.getInseminationsActive(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;

        this.inseminations = data;
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  isLoading: boolean = false;
  isData: boolean = false;

  ListNacimiento(IdFarm: number): void {
    this.isLoading = true;
    this.nacimientoService.getNacimiento(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.data = data;
        this.nacimiento = data;
        this.isLoading = false
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isData = data.length === 0;
      }
    });
    error: () => {
      this.isLoading = false;
      this.alertaService.ErrorAlert('Error al obtener los datos de nacimiento')
    }
  }

  downloadExcel(){
 // Crear un arreglo con los datos de los animales
    const bornlData = this.nacimiento.map(nacimiento => ({
      ID: nacimiento.id,
      Asistencia: nacimiento.assistence,
      Resultado: nacimiento.result,
      Descripción: nacimiento.description,
      Peso: nacimiento.birthWeight,
      Madre: nacimiento.created_at,
      Nacimiento: nacimiento.created_at,
    }));

    // Crear un libro de trabajo (workbook) y una hoja (worksheet)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(bornlData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nacimientos');

    // Exportar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'nacimientos.xlsx');
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
    doc.text('Histórico de nacimientos', 14, 23); // Título del PDF

    // Encabezados de la tabla
    const headers = [['id', 'Asistencia', 'Resultado', 'Descripción', 'Madre', 'Fecha']];

    // Datos de la tabla
    const data = this.nacimiento.map(nacimiento => [
      nacimiento.id,
      nacimiento.assistence ? 'SÍ' : 'NO',
      nacimiento.result ? 'EXITOSO' : 'FALLIDO',
      nacimiento.description,
      nacimiento.insemination,
      nacimiento.created_at,
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
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      }
    });

    // Guardar el archivo PDF
    doc.save('nacimientos.pdf');
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
            }
          },
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
              assistence: 0,
              result: 0,
              description: '',
              birthWeight: 0,
              inseminationId: 0
            }
            if (this.IdFarm !== null) {
              this.ListNacimiento(this.IdFarm);

            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar');
          }
        });
      } else {

        const formData = form.value;
        console.log(this.newNacimiento.inseminationId )
        const Data: Nacimiento = {
          ...formData,
          assistence: this.newNacimiento.assistence ? true:false,
          result: this.newNacimiento.result ? true:false,
          state: true,
          inseminationId: this.newNacimiento.inseminationId 
        }
        this.nacimientoService.createNacimiento(Data).subscribe({
          next: () => {

            Swal.fire({
              title: `Nacimiento registrado con éxito!`,
              icon: 'success',
              confirmButtonText: 'OK',
              buttonsStyling: false,
              html: `
                <a href="animales" routerLink="/animales" class="btn btn-success px-4" style="text-decoration: none;">
                  Agregar animal
                </a>
              `,
              customClass: {
                confirmButton: 'btn btn-primary px-4',
              },
            });
            form.reset();
            if (this.IdFarm !== null) {
              this.ListNacimiento(this.IdFarm);

            }
          },
          error: (err) => {
            console.error(err);
            this.alertaService.ErrorAlert('Error al crear');
          }
        });
      }
    } else {
      this.alertaService.ErrorAlert('Por favor completa todos los campos');
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
