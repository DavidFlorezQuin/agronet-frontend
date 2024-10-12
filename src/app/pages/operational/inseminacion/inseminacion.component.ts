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

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';
import { MatIconModule } from '@angular/material/icon';
import { Animal } from '../animal/animal.module';
import { AnimalService } from '../animal/animal.service';
import Swal from 'sweetalert2';

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

  IdFarm: number | null = null;
  bulls: Animal[] = [];
  cows: Animal[] = [];
  dataSource: MatTableDataSource<Insemination> = new MatTableDataSource<Insemination>();

  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'description', 'semen', 'mother', 'result', 'inseminationType', 'state', 'acciones'];

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
  listCows(IdFarm: number): void {
    this.animalesService.getAnimalsCows(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.cows = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }
  listBulls(IdFarm: number): void {
    this.animalesService.getAnimalsBulls(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.bulls = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
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

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newInsemination.id > 0) {
        this.inseminationService.updateInsemination(this.newInsemination, this.newInsemination.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            if (this.IdFarm !== null) {
              this.listInseminations(this.IdFarm);
            }
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
