import { Component, OnInit } from '@angular/core';
import { Animal } from './animal.module';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../shared/components/alert.service';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { ViewChild } from '@angular/core';
import { AnimalService } from './animal.service';
import { state } from '@angular/animations';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import { LoteService } from '../lote/lote.service';
import { Lote } from '../lote/lote.module';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    DataTablesModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './animal.component.html'})
export class AnimalComponent implements OnInit {

  animales: Animal[] = [];
  IdFarm: number | null = null; // Propiedad para almacenar el ID

  newAnimales: Animal = {
    id: 0, name: '', weight: 0, photo: '', raceId: 0, gender:'', purpose: '', birthDay: new Date(), state: true, lotId: 0, lot:'', race:''
  };
  displayedColumns: string[] = ['id', 'animal', 'weight','gender', 'race', 'purpose', 'birthDay', 'lotId', 'acciones'];

  dataSource!: MatTableDataSource<Animal>;

  lote: Lote[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private animalService: AnimalService, private alertaService: AlertService, private loteService:LoteService) { }
  
  ngOnInit(): void {  
    const idFarmString = localStorage.getItem('idFincaSeleccionada');
    
    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); // Convertir a number
    } else {
      console.error('ID de la finca no válido o no presente en localStorage');
      this.IdFarm = null; // Si no hay ID, establecer a null
    }
    
    if (this.IdFarm !== null) {
      this.ListAnimal(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }

    this.listLot(); 

  }
  


  listLot(): void {
    this.loteService.getLote().subscribe({
      next: (res: any) => {
        const data = res.data; 
        this.lote = data;
      },
      error: (err) => {
        this.alertaService.ErrorAlert('Algo salió mal')
      }
    })
  
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
    const headers = [['id', 'Animal', 'Raza', 'Peso','Género', 'Propósito', 'Nacimiento', 'Lote']];
  
    // Datos de la tabla
    const data = this.dataSource.data.map(animales => [
      animales.id, 
      animales.name, 
      animales.race, 
      animales.weight, 
      animales.gender,
      animales.purpose,
      animales.birthDay,
      animales.lot
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
        2: { cellWidth: 20 },  
        3: { cellWidth: 20 },   
        4: { cellWidth: 20 },   
        5: { cellWidth: 20 },   
        6: { cellWidth: 20 },   
        7: { cellWidth: 20 },   
      }
    });
  
    // Guardar el archivo PDF
    doc.save('animal.pdf');
  }


  ListAnimal(farmId: number): void {
    this.animalService.getAnimals(farmId).subscribe({
      next: (res: any) => {
        const data = res.data; 
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.animales = data; 
        this.dataSource.data = data;
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los animales');
      }
    });
  }
  

  aplicarFiltro(event: Event): void {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  onEdit(animal: Animal): void {
    this.newAnimales = { ...animal };
  }

  eliminar(id: number): void {
    this.alertaService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.animalService.deleteAnimal(id).subscribe({
          next: (res) => {
            this.alertaService.SuccessAlert('Eliminado con éxito');
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
      if (this.newAnimales.id > 0) {
        this.animalService.updateAnimal(this.newAnimales, this.newAnimales.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado con éxito');
            form.reset();
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
      if (this.newAnimales.id > 0) {
        this.animalService.updateAnimal(this.newAnimales, this.newAnimales.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado correctamente');
            form.reset();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.animalService.createAnimal(this.newAnimales).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Creado correctamente');
            form.reset();
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






}
