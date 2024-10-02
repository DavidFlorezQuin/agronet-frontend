
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, NgForm } from '@angular/forms';
import { LoteService } from './lote.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Lote } from './lote.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-lote',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './lote.component.html'
})
export class LoteComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'hectare', 'farmId', 'actions'];
  dataSource!: MatTableDataSource<Lote>;

  lote: Lote[] = [];
  newLote: Lote = {
    id: 0, name: '', hectare: 0,
    farmId: 0,

  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private loteService: LoteService, private alertaService: AlertService) { }
  ngOnInit(): void {

    this.listLot();
  }

  listLot(): void {

    this.loteService.getLote().subscribe({
      next: (res: any) => {

        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los datos');
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
    doc.text('Histórico de lotes', 14, 23); // Título del PDF

    // Encabezados de la tabla
    const headers = [['id', 'name', 'hectare', 'farmId']];

    // Datos de la tabla
    const data = this.dataSource.data.map(lote => [
      lote.id,
      lote.name,
      lote.hectare,
      lote.farmId,
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
        1: { cellWidth: 50 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 }
      }
    });

    // Guardar el archivo PDF
    doc.save('modulos.pdf');
  }

  onEdit(lot: Lote): void {
    this.newLote = { ...lot };
  }

  onDelete(id: number): void {
    this.alertaService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.loteService.deleteLote(id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Eliminado correctamente');
            this.listLot();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newLote.id > 0) {
        this.loteService.updateLote(this.newLote, this.newLote.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newLote = {
              id: 0, name: '', hectare: 0,
              farmId: 0,
            };
            this.listLot();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.loteService.createLote(this.newLote).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listLot();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al crear');
          }
        });
      }
    } else {
      this.alertaService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
