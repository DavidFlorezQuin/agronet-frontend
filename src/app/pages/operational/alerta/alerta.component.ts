import { FormsModule, NgForm } from '@angular/forms';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { Alerta } from './alerta.module';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { AlertaService } from './alerta.service';
import { AlertService } from '../../../shared/components/alert.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-alerta',
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
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.css'
})
export class AlertaComponent implements OnInit {
  alerta: Alerta[] = [];


  newAlerta: Alerta = { id: 0, name: '', description: '', date: new Date, isRead: new Boolean, animalId: 0, categoryAlertId: 0, usersId: 0 };

  displayedColumns: string[] = ['id', 'name', 'date', 'isRead', 'animalId', 'categoryAlertId', 'usersId', 'acciones'];
  dataSource!: MatTableDataSource<Alerta>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private AlertaService: AlertaService, private alertService: AlertService) { }

  ngOnInit(): void {

    this.listAlerta();

  }

  
  
  listAlerta(): void {
    this.AlertaService.getAlerta().subscribe({
      next: (res: any) => {
        const data = res.data; 
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
        this.alerta = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }
  
  downloadPDF(): void {
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
    doc.text('Histórico de alertas', 14, 23); // Título del PDF
  
    // Encabezados de la tabla
    const headers = [['id', 'Nombre', 'Description', 'Date', 'IsRead', 'AnimalId', 'CategoryAlertId', 'UsersId']];
  
    // Datos de la tabla
    const data = this.dataSource.data.map(alerta => [
      alerta.id, 
      alerta.name, 
      alerta.description, 
      alerta.date,
      alerta.isRead,
      alerta.animalId,
      alerta.categoryAlertId
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
        2: { cellWidth: 50 },  
        3: { cellWidth: 30 },   
        4: { cellWidth: 20 },   
        5: { cellWidth: 20 },   
        6: { cellWidth: 20 },   
        7: { cellWidth: 10 }   
      }
    });
  
    // Guardar el archivo PDF
    doc.save('alertas.pdf');
  }
  
  onEdit(alerta: Alerta): void {
    this.newAlerta = { ...alerta };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.AlertaService.deleteAlerta(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listAlerta();
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
      if (this.newAlerta.id > 0) {
        this.AlertaService.updateAlerta(this.newAlerta, this.newAlerta.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newAlerta = { id: 0, name: '', description: '', date: new Date, isRead: new Boolean, animalId: 0, categoryAlertId: 0, usersId: 0 };
            this.listAlerta();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.AlertaService.createAlerta(this.newAlerta).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listAlerta();
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

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
