import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { AlertService } from '../../../shared/components/alert.service';
import { AnimalDiagnosticsService } from './animal-diagnostico.service';
import { AnimalService } from '../animal/animal.service';
import { UserService } from '../../../features/Security/users/user.service';
import { Animal } from '../animal/animal.module';
import { User } from '../../../features/Security/users/User.module';
import { AnimalDiagnostics } from './AnimalDiagnostics.module';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import jsPDF from 'jspdf';
import { ViewChild, ElementRef } from '@angular/core';
declare var bootstrap: any;
import { Modal } from 'bootstrap';
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
  templateUrl: './animal-diagnostico.component.html',
  styleUrl: './animal-diagnostico.css'
})
export class AnimalDiagnosticoComponent implements OnInit {
  IdFarm: number | null = null;
  usersId: number | null = null; // Definir como propiedad de la clase

  diagnostics: AnimalDiagnostics[] = [];
  animales: Animal[] = [];
  usuarios: User[] = [];

  newDiagnostic: AnimalDiagnostics = {
    id: 0, name:'', animal:'', users:'',state:'', diagnosis: '', animalId: 0, usersId: 0, DiseaseStatus: ''

  };

  displayedColumns: string[] = ['id', 'name','diagnosis', 'animal', 'users', 'estado', 'acciones'];
  dataSource: MatTableDataSource<AnimalDiagnostics> = new MatTableDataSource<AnimalDiagnostics>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;

  constructor(
    private diagnosticsService: AnimalDiagnosticsService,
    private animalService: AnimalService,
    private usersService: UserService,
    private alertaService: AlertService
  ) { }

  ngOnInit(): void {
    const StorageId: string | null = localStorage.getItem('Usuario');
    this.usersId = Number(StorageId);
    this.newDiagnostic.usersId = this.usersId;
    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); // Convertir a number
    } else {
      console.error('ID de la finca no válido o no presente en localStorage');
      this.IdFarm = null; // Si no hay ID, establecer a null
    }

    if (this.IdFarm !== null) {
      this.listDiagnostics(this.IdFarm);
      this.ListAnimal(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
      this.setDefaultSelections();
  }

  setDefaultSelections(): void {
    // Si hay toros disponibles, seleccionar el primero como valor predeterminado
    if (this.animales.length > 0) {
      this.newDiagnostic.animalId = this.animales[0].id;
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



  onEdit(AnimalDiagnostic: AnimalDiagnostics) {
    this.newDiagnostic = { ...AnimalDiagnostic };

  }


  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  closeModal(): void {
    const modalElement = document.getElementById('diagnosticsModal');
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
      if (this.newDiagnostic.id > 0) {
        const formData = form.value;
        const diagnosticData: AnimalDiagnostics = {
          id: this.newDiagnostic.id, // Agrega el ID aquí
          ...formData,
          name: this.newDiagnostic.name,
          diagnosis: this.newDiagnostic.diagnosis,
          animalId:this.newDiagnostic.animalId
        };
        this.diagnosticsService.updateAnimalDiagnostics(diagnosticData, this.newDiagnostic.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado correctamente');
            
            if (this.IdFarm !== null) {
              this.listDiagnostics(this.IdFarm);
              
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }      
            form.reset();   
            this.closeModal();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        const formData = form.value; 
        const diagnostic: AnimalDiagnostics = {
          ...formData,
          usersId:Number(formData.usersId),
          DiseaseStatus: 'PENDIENTE'
        }
        this.diagnosticsService.createAnimalDiagnostics(diagnostic).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Creado correctamente');
            
            if (this.IdFarm !== null) {
              this.listDiagnostics(this.IdFarm);
              
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
            form.reset();
            this.closeModal();          
            },
          error: () => {
            this.alertaService.ErrorAlert('Error al crear');
          }
        });
      }
    }
  }

  ListAnimal(farmId: number): void {
    this.animalService.getAnimals(farmId).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.animales = data;
        this.setDefaultSelections();
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los animales');
      }
    });
  }

  onDelete(id: number): void {
    this.alertaService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.diagnosticsService.deleteAnimalDiagnostics(id).subscribe({
          next: (res) => {
            this.alertaService.SuccessAlert('Eliminado con éxito');
            if (this.IdFarm !== null) {
              this.listDiagnostics(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }            },
          error: () => {
            this.alertaService.ErrorAlert('Error al eliminar el diagnostico');
          }
        });
      }
    });

  }



}
