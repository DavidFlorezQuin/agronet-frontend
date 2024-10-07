import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '../../../shared/components/alert.service';
import { AnimalDiagnosticsService } from './animal-diagnostico.service';
import { AnimalService } from '../animal/animal.service';
import { UserService } from '../../../features/Security/users/user.service';
import { Animal } from '../animal/animal.module';
import { User } from '../../../features/Security/users/User.module';
import { AnimalDiagnostics } from './animal-diagnostico.module';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-animal-diagnostico',
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
  templateUrl: './animal-diagnostico.component.html'
})
export class AnimalDiagnosticoComponent implements OnInit {

  IdFarm: number = 4;

  diagnostics: AnimalDiagnostics[] = [];
  animales: Animal[] = [];
  usuarios: User[] = [];

  newDiagnostic: AnimalDiagnostics = {
    id: 0, name:'', animal:'', users:'',state:'', diagnosis: '', animalId: 0, usersId: 0,

  };

  displayedColumns: string[] = ['id', 'diagnosis', 'animal', 'users', 'acciones'];
  dataSource: MatTableDataSource<AnimalDiagnostics> = new MatTableDataSource<AnimalDiagnostics>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private diagnosticsService: AnimalDiagnosticsService,
    private animalService: AnimalService,
    private usersService: UserService,
    private alertaService: AlertService
  ) { }

  ngOnInit(): void {
    this.listDiagnostics(this.IdFarm);
    // this.listAnimals();
    // this.listUsers();
  }

  listDiagnostics(IdFarm: number): void {
    this.diagnosticsService.getAnimalDiagnostics(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
        this.diagnostics = data;
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los diagnósticos');
      }
    });
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
    doc.text('Histórico de modulos', 14, 23); // Título del PDF
  
    // Encabezados de la tabla
    const headers = [['id','Nombre', 'Diagnostico', 'Usuario', 'Animal','Estado']];
  
    // Datos de la tabla
    const data = this.dataSource.data.map(newDiagnostic => [
      newDiagnostic.id,
      newDiagnostic.name,
      newDiagnostic.diagnosis,
      newDiagnostic.users,
      newDiagnostic.animal,
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
    doc.save('animal-diagnostic.pdf');
  }

  // listAnimals(): void {
  //   this.animalService.getAnimals().subscribe({
  //     next: (res: any) => {
  //       this.animales = res.data;
  //     },
  //     error: () => {
  //       this.alertaService.ErrorAlert('Error al obtener los animales');
  //     }
  //   });
  // }

  onEdit(AnimalDiagnostic: AnimalDiagnostics) {

  }

  // listUsers(): void {
  //   this.usersService.getUsers().subscribe({
  //     next: (res: any) => {
  //       this.usuarios = res.data;
  //     },
  //     error: () => {
  //       this.alertaService.ErrorAlert('Error al obtener los usuarios');
  //     }
  //   });
  // }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newDiagnostic.id > 0) {
        this.diagnosticsService.updateAnimalDiagnostics(this.newDiagnostic, this.newDiagnostic.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.listDiagnostics(this.IdFarm);
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.diagnosticsService.createAnimalDiagnostics(this.newDiagnostic).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listDiagnostics(this.IdFarm);
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al crear');
          }
        });
      }
    }
  }

  onDelete(id: number): void {
    this.alertaService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.diagnosticsService.deleteAnimalDiagnostics(id).subscribe({
          next: (res) => {
            this.alertaService.SuccessAlert('Eliminado con éxito');
            this.listDiagnostics(this.IdFarm);
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al eliminar el animal');
          }
        });
      }
    });

  }



}
