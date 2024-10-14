import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

import { AlertService } from '../../../shared/components/alert.service';
import { Inventories } from './Inventories.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { InventoriesService } from './inventario.service';
import { Finca } from '../finca/finca.module';
import { FincaService } from '../finca/finca.service';
import { DataTablesModule } from 'angular-datatables';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-inventario',
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
  templateUrl: './inventario.component.html'
})
export class InventarioComponent implements OnInit {

  IdFarm: number | null = null;
  newInventory: Inventories = {
    id: 0,
    name: '',
    description: '',
    farmId: 0,
  };

  inventories: Inventories[] = [];

  displayedColumns: string[] = ['id', 'name', 'description', 'farmId', 'acciones'];
  dataSource!: MatTableDataSource<Inventories>;
  fincas: Finca[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private inventoriesService: InventoriesService, private alertService: AlertService, private fincaService: FincaService) { }

  ngOnInit(): void {

    const StorageId: string | null = localStorage.getItem('Usuario');
    const IdUser: number = StorageId ? Number(StorageId) : 0; 
    
    
    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString);
    } else {
      this.IdFarm = null;
    }

    if (this.IdFarm !== null) {

      this.listInventories(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }

    this.listFinca(IdUser);
    this.setDefaultSelections();
  }

  listInventories(IdFarm: number): void {
    this.inventoriesService.getInventories(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.inventories = data;
        this.dataSource.data = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener inventarios');
      }
    });
  }
  checkValidSelection(field: NgModel) {
    if (field.value === '') {
      field.control.setErrors({ required: true });
    } else {
      field.control.setErrors(null);
    }
    field.control.markAsTouched();  // Asegurarse de marcar el campo como tocado
  }
  setDefaultSelections(): void {
    // Si hay toros disponibles, seleccionar el primero como valor predeterminado
    if (this.fincas.length > 0) {
      this.newInventory.farmId= this.fincas[0].id;
    }
    
  }
  downloadPDF() {
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
    doc.text('Histórico de inventario', 14, 23); // Título del PDF

    // Encabezados de la tabla
    const headers = [['id', 'Nombre', 'Descripción', 'Farm']];

    // Datos de la tabla
    const data = this.dataSource.data.map(inseminations => [
      inseminations.id,
      inseminations.name,
      inseminations.description,
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
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },

      }
    });

    // Guardar el archivo PDF
    doc.save('inventario.pdf');
  }

  listFinca(IdUser:number): void {
    this.fincaService.getFincas(IdUser).subscribe({
      next: (res: any) => {
        const data = res.data; 
        this.fincas = data;
        this.setDefaultSelections(); 
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos de las fincas');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newInventory.id > 0) {
        const formData = form.value;
        const Data: Inventories = {
          ...formData,
          id: this.newInventory.id,
          name: this.newInventory.name,
          description: this.newInventory.description,
          farmId:this.newInventory.farmId
        }

        this.inventoriesService.updateInventory(Data, this.newInventory.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Inventario actualizado correctamente');
            form.reset();
            if (this.IdFarm !== null) {

              this.listInventories(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar inventario');
          }
        });
      } else {
        this.inventoriesService.createInventory(this.newInventory).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Inventario creado correctamente');
            form.reset();

            if (this.IdFarm !== null) {
              this.listInventories(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
            
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear inventario');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onEdit(inventory: Inventories): void {
    this.newInventory = { ...inventory };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.inventoriesService.deleteInventory(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Inventario eliminado correctamente');
            if (this.IdFarm !== null) {

              this.listInventories(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar inventario');
          }
        });
      }
    });
  }


  aplicarFiltro(event: Event): void {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
