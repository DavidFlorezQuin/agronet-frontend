import { Component, OnInit  } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { InseminationService } from './inseminacion.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Insemination } from './Insemination.module';
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';
import { MatIconModule } from '@angular/material/icon';
import { Animal } from '../animal/animal.module';
import { AnimalService } from '../animal/animal.service';
import Swal from 'sweetalert2';
import { ViewChild, ElementRef } from '@angular/core';
declare var bootstrap: any;
import { Modal } from 'bootstrap';
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
  styleUrl: './inseminacion.component.css'
})
export class InseminationComponent implements OnInit {

  IdFarm: number | null = null;
  bulls: Animal[] = [];
  cows: Animal[] = [];
  dataSource: MatTableDataSource<Insemination> = new MatTableDataSource<Insemination>();

  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;

  displayedColumns: string[] = ['id', 'description', 'semen', 'mother', 'result', 'inseminationType', 'acciones'];

  inseminations: Insemination[] = [];

  newInsemination: Insemination = {
    id: 0,
    description: '',
    semenId: 0,
    motherId: 0,
    result: '',
    inseminationType: ''
  };

  constructor(private animalesService: AnimalService, private inseminationService: InseminationService, private alertService: AlertService) { }


  ngOnInit(): void {

    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString);
    } else {
      this.IdFarm = null;
    }

    if (this.IdFarm !== null) {
      this.listInseminations(this.IdFarm);
      this.listBulls(this.IdFarm);
      this.listCows(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
    this.setDefaultSelections();

  }
  /** el isValidOption sirve para la parte de padre de semental no de la finca*/
  isValidOption(value: string): boolean {
    return value !== '' && value !== 'no-propiedad'; // Cambia 'no-propiedad' al valor que hayas asignado
  }
  listInseminations(IdFarm: number): void {
    this.inseminationService.getInseminations(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.inseminations = data;
        this.dataSource.data = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }
  setDefaultSelections(): void {
    // Si hay toros disponibles, seleccionar el primero como valor predeterminado
    if (this.bulls.length > 0) {
      this.newInsemination.semenId = this.bulls[0].id;
    }
    // Si hay vacas disponibles, seleccionar la primera como valor predeterminado
    if (this.cows.length > 0) {
      this.newInsemination.motherId = this.cows[0].id;
    }
  }
  checkValidSelection(field: NgModel) {
    if (field.value === '') {
      field.control.setErrors({ required: true });
    } else {
      field.control.setErrors(null);
    }
    field.control.markAsTouched();  // Asegurarse de marcar el campo como tocado
  }

  listCows(IdFarm: number): void {
    this.animalesService.getAnimalsCows(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.cows = data;
        this.setDefaultSelections();
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }
  validateSelection(field: NgModel) {
    if (field.value === '') {
      field.control.setErrors({ required: true });
      field.control.markAsTouched();
    }

  }
  listBulls(IdFarm: number): void {
    this.animalesService.getAnimalsBulls(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.bulls = data;
        this.setDefaultSelections();
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  registerAbortion(idRegister:number):void{
    this.inseminationService.registerAbortion(idRegister).subscribe({
      next: (res: any) => {
        this.alertService.SuccessAlert('Registro de aborto');
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    })
  }

  downloadPDF(): void {
    const doc = new jsPDF();

    doc.setFontSize(16); // Tamaño de fuente para el título
    doc.setTextColor(22, 160, 133); // Cambiar el color del título
    doc.text('AGRONET', 14, 10); // Título del PDF

    // Agregar subtítulo debajo del título
    doc.setFontSize(10); // Tamaño de fuente para el subtítulo
    doc.setTextColor(0, 0, 0); // Color negro para el subtítulo
    doc.text('Sistema de gestión de ganadería colombiana', 14, 13); // Subtítulo

    doc.setFontSize(16); // Tamaño de fuente para el título
    doc.setTextColor(22, 160, 133); // Cambiar el color del título
    doc.text('Histórico de inseminaciones', 14, 23); // Título del PDF

    // Encabezados de la tabla
    const headers = [['id', 'Descripción', 'Madre', 'Padre', 'Resultado', 'Tipo Inseminación', 'Estado']];

    // Datos de la tabla
    const data = this.dataSource.data.map(inseminations => [
      inseminations.id,
      inseminations.description,
      inseminations.result,
      inseminations.inseminationType
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
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 }
      }
    });

    // Guardar el archivo PDF
    doc.save('Inseminaciones.pdf');
  }


  onEdit(insemination: Insemination): void {
    this.newInsemination = { ...insemination };
    // Verificar si la vaca seleccionada (motherId) existe en la lista de vacas
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.inseminationService.deleteInsemination(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            if (this.IdFarm !== null) {
              this.listInseminations(this.IdFarm);
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }
// Función para cerrar el modal
closeModal(): void {
  const modalElement = document.getElementById('inseminacionModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide(); // Cierra el modal
    modalElement.classList.remove('show');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = ''; // Restaurar el overflow del body

    // Eliminar cualquier 'modal-backdrop' que haya quedado
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove(); // Elimina la capa de fondo negra
    }
  } else {
    console.error('El modal no se encontró. Asegúrate de que el ID sea correcto.');
  }
}
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newInsemination.id > 0) {

        const formData = form.value;
        const Data: Insemination = {
          ...formData,
          id: this.newInsemination.id,
          semenId: this.newInsemination.semenId ?? null,
          result: this.newInsemination.result,
          description: this.newInsemination.description,
          inseminationType: this.newInsemination.inseminationType,
          motherId: this.newInsemination.motherId
        }
        this.inseminationService.updateInsemination(Data, this.newInsemination.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            if (this.IdFarm !== null) {
              this.listInseminations(this.IdFarm);
              
            }
            this.closeModal();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {

        const formData = form.value;
        const Data: Insemination = {
          ...formData,
          semenId: this.newInsemination.semenId ?? null,
          result: 'PENDIENTE',
          motherId: this.newInsemination.motherId,
          state:true
        }

        this.inseminationService.createInsemination(Data).subscribe({
          next: () => {

            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.newInsemination = {
              id: 0, description: '',
              semenId: 0,
              motherId: 0,
              result: '',
              inseminationType: ''
            };
            if (this.IdFarm !== null) {
              this.listInseminations(this.IdFarm);
              
            }
            this.closeModal();
          },
          error: (err) => {
            let errorMessage = err.error?.message || err.message || "Ha ocurrido un error inesperado.";
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: errorMessage || "Ha ocurrido un error inesperado.",
            });
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
