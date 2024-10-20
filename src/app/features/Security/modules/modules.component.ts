
import { ModuleService } from './module.service';
import { Modulo } from './modulo.module';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { AlertService } from '../../../shared/components/alert.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-modules',
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
  templateUrl: './modules.component.html',
  styles: ``
})
export class ModulesComponent implements OnInit {
  newModulo: Modulo = { id: 0, name: '', description: '', orders: 0 };
  displayedColumns: string[] = ['id', 'name', 'description', 'orders', 'acciones'];
  dataSource!: MatTableDataSource<Modulo>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(private moduloService: ModuleService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.listModulos();
  }

  listModulos(): void {
    this.moduloService.getModules().subscribe({
      next: (res: Modulo[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    doc.text('Histórico de modulos', 14, 23); // Título del PDF
  
    // Encabezados de la tabla
    const headers = [['Id', 'Nombre', 'Descripción', 'Órdenes']];
  
    // Datos de la tabla
    const data = this.dataSource.data.map(modulo => [
      modulo.id, 
      modulo.name, 
      modulo.description, 
      modulo.orders
    ]);
  
    // Generar tabla usando autoTable
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 30, // Posición donde empieza la tabla
      theme: 'grid', // Estilo de la tabla
      headStyles: { fillColor: [22, 160, 133] }, // Estilo de encabezado
      styles: {
        fontSize: 10, // Tamaño de fuente en la tabla
        cellPadding: 2, // Espaciado dentro de las celdas
      },
      columnStyles: {
        0: { cellWidth: 10 },   // Ancho de la columna Id
        1: { cellWidth: 30 },   // Ancho de la columna Nombre
        2: { cellWidth: 100 },  // Ancho de la columna Descripción
        3: { cellWidth: 20 },   // Ancho de la columna Órdenes
      }
    });
  
    // Guardar el archivo PDF
    doc.save('modulos.pdf');
  }
  
  
  resetForm(): void {
    this.newModulo = { id: 0, name: '', description: '', orders: 0 };
  }
  
  onEdit(modulo: Modulo): void {
    this.newModulo = { ...modulo };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.moduloService.deleteModules(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listModulos();
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
  const modal = new bootstrap.Modal(this.Modal.nativeElement);  // Usar la referencia del modal
  modal.hide();  // Cerrar el modal
}
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newModulo.id > 0) {
        this.moduloService.updateModules(this.newModulo, this.newModulo.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newModulo = { id: 0, name: '', description: '', orders: 0 };
            this.listModulos();
            this.closeModal();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.moduloService.createModules(this.newModulo).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listModulos();
            this.closeModal();
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

