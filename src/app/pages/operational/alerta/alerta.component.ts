import { FormsModule, NgForm, NgModel } from '@angular/forms';

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
import { AnimalService } from '../animal/animal.service';
import { Animal } from '../animal/animal.module';
import { CategoriaAlertaaService } from '../../Parametro/categoria-alerta/categoria-alerta.service';
import { CategoriaAlerta } from '../../Parametro/categoria-alerta/categoria-alerta.module';

@Component({
  selector: 'app-alerta',
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
    MatSortModule,
  ],
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.css'
})
export class AlertaComponent implements OnInit {

  // Fecha actual
  minDate: string = new Date().toISOString().split('T')[0];

  alerta: Alerta[] = [];
  IdFarm: number | null = null;
  IdUser: number | null = null;
  animals: Animal[] = [];
  CategoriaAlerta: CategoriaAlerta[] = [];

  newAlerta: Alerta = {
    id: 0,
    name: '',
    description: '',
    date: new Date(),
    isRead: false,
    animalId: 0,
    categoryAlertId: 0,
    usersId: 0,
  };

  displayedColumns: string[] = ['id', 'name', 'date', 'isRead', 'animal', 'categoryAlert', 'users', 'acciones'];
  dataSource!: MatTableDataSource<Alerta>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private AlertaService: AlertaService, private alertService: AlertService, private animalService: AnimalService, private CategoriaAlertaaService: CategoriaAlertaaService) { }

  ngOnInit(): void {
    const StorageId: string | null = localStorage.getItem('Usuario');
    this.IdUser = Number(StorageId);
    this.newAlerta.usersId = this.IdUser;

    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); // Convertir a number
    } else {
      this.IdFarm = null; // Si no hay ID, establecer a null
    }

    if (this.IdFarm !== null) {
      this.listAlerta(this.IdFarm);
      this.ListAnimal(this.IdFarm);
      this.listCategoryAlert();
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
  }


  ListAnimal(farmId: number): void {
    this.animalService.getAnimals(farmId).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.animals = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los animales');
      }
    });
  }

  listAlerta(IdFarm: number): void {
    this.AlertaService.getAlerta(IdFarm).subscribe({
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

  listCategoryAlert(): void {
    this.CategoriaAlertaaService.getCategoriaAlerta().subscribe({
      next: (res: any) => {

        const data = res.data;
        this.CategoriaAlerta = data;
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
    const headers = [['id', 'Nombre', 'Description', 'Date', 'IsRead', 'animal', 'categoryAlert', 'users']];

    // Datos de la tabla
    const data = this.dataSource.data.map(alerta => [
      alerta.id,
      alerta.name,
      alerta.description,
      alerta.date,
      alerta.isRead,
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

    if (this.newAlerta.date) {
      const dateObj = new Date(this.newAlerta.date);
      this.newAlerta.date = dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }
  }

  checkValidSelection(field: NgModel): void {
    const hasValue = field.value.trim() !== '';
    field.control.setErrors(hasValue ? null : { required: true });
    field.control.markAsTouched();
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.AlertaService.deleteAlerta(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            if (this.IdFarm !== null) {
              this.listAlerta(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
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
    if (!form.valid) {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
      return;
    }

    const formData = form.value;
    const alertaData: Alerta = {
      id: this.newAlerta.id, // Agrega el ID aquí
      ...formData,
      animalId: Number(formData.animalId) !== 0 ? Number(formData.animalId) : null,
      categoryAlertId: Number(formData.categoryAlertId),
      usersId: Number(formData.usersId),
      isRead: false,
      date: new Date(formData.date).toISOString()
    };

    if (this.newAlerta.id > 0) {
      this.AlertaService.updateAlerta(alertaData, this.newAlerta.id).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Actualizado correctamente');
          this.resetForm();
          if (this.IdFarm !== null) {
            this.listAlerta(this.IdFarm);
          }
        },
        error: (err) => {
          console.error(err);
          this.alertService.ErrorAlert('Error al actualizar: ' + err.message);
        }
      });
    } else {
      this.AlertaService.createAlerta(alertaData).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Creado correctamente');
          this.resetForm();
          if (this.IdFarm !== null) {
            this.listAlerta(this.IdFarm);
          }
        },
        error: (err) => {
          console.error(err);
          this.alertService.ErrorAlert('Error al crear: ' + err.message);
        }
      });
    }

  }

  setDefaultSelections(): void {
    // Si hay toros disponibles, seleccionar el primero como valor predeterminado
    if (this.animals.length > 0) {
      this.newAlerta.animalId= this.animals[0].id;
    }
    // Si hay vacas disponibles, seleccionar la primera como valor predeterminado
    if (this.CategoriaAlerta.length > 0) {
      this.newAlerta.categoryAlertId= this.CategoriaAlerta[0].id;
    }
  }


  resetForm(): void {
    this.newAlerta = { ...this.newAlerta, id: 0, name: '', description: '', date: new Date(), isRead: false };
  }


  private refreshAlertList(): void {
    if (this.IdFarm !== null) {
      this.listAlerta(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
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