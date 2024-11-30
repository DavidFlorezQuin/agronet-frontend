import { Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductionsService } from './produccion.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Productions } from './produccion.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { Animal } from '../animal/animal.module';
import { AnimalService } from '../animal/animal.service';
import jsPDF from 'jspdf';
import { EnumService } from '../../../shared/components/enum.service';
import Swal from 'sweetalert2';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-produccion',
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
  templateUrl: './produccion.component.html'
})
export class ProduccionComponent implements OnInit {

  // Fecha mínima: 1 año en el futuro
  minExpirateDate: string = new Date(new Date().setFullYear(new Date().getFullYear() + 0,9)).toISOString().split('T')[0];
  
  // Fecha máxima: 10 años en el futuro
  maxExpirateDate: string = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];


  IdFarm: number | null = null;
  newProduction: Productions = {
    id: 0,
    typeProduction: '',
    stock: 0,
    measurement: '',
    description: '',
    quantityTotal: 0,
    expirateDate: new Date(),
    animalId: 0,

  };

  measurements: [] = [];
  animales: Animal[] = [];
  productions: Productions[] = [];
  displayedColumns: string[] = [
    'id',
    'TypeProduction',
    'Stock',
    'Measurement',
    'description',
    'QuantityTotal',
    'expirateDate',
    'AnimalId',
    'estado',
    'accions']

  dataSource!: MatTableDataSource<Productions>;

  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(private productionsService: ProductionsService, private animalService: AnimalService, private alertService: AlertService, private enumController: EnumService) { }

  ngOnInit(): void {

    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); // Convertir a number
    } else {
      this.IdFarm = null; // Si no hay ID, establecer a null
    }

    if (this.IdFarm !== null) {
      this.listProductions(this.IdFarm);
      this.ListAnimal(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
    this.listMeasurement();
    this.setDefaultSelections();
  }
  checkValidSelection(selectControl: any): void {
    if (selectControl.invalid && selectControl.touched) {
      console.error('Selección no válida');

      if (selectControl.value === '') {
        selectControl.control.setErrors({ required: true });
      } else {
        selectControl.control.setErrors(null);
      }
      selectControl.control.markAsTouched(); 
    }
  }
  ListAnimal(farmId: number): void {
    this.animalService.getAnimalsMilks(farmId).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.animales = data;
        this.setDefaultSelections();
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los animales');
      }
    });
  }  

  listProductions(farmId: number): void {
    this.productionsService.getProductions(farmId).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.productions = data;
        this.dataSource.data = data;
      },
      error: (error) => {
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
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
    doc.text('Histórico de producción', 14, 23); // Título del PDF

    // Encabezados de la tabla
    const headers = [['id', 'Tipo producción', 'Stock', 'Medida', 'Descripción', 'Cantidad total', 'animal', 'fecha expiración']];

    // Datos de la tabla
    const data = this.dataSource.data.map(productions => [
      productions.id,
      productions.typeProduction,
      productions.stock,
      productions.measurement,
      productions.description,
      productions.quantityTotal,
      productions.expirateDate,


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
        4: { cellWidth: 30 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 }
      }
    });

    // Guardar el archivo PDF
    doc.save('Produccion.pdf');
  }

  listMeasurement(): void {
    this.enumController.getMeasurement().subscribe({
      next: (res: any) => {
        this.measurements = res;
      },
      error: (error) => {
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
  }

  updateStock(quantityTotal: number): void {
    this.newProduction.stock = quantityTotal; // Actualiza stock con el valor de cantidad total
  }
  
 // Función para cerrar el modal
 closeModal(): void {
  const modalElement = document.getElementById('animalModal');
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
      if (this.newProduction.id > 0) {

        const formData = form.value;
        const Data: Productions = {
          ...formData,
          id:this.newProduction.id,
          animalId: this.newProduction.animalId,
          description: this.newProduction.description,
          expirateDate: this.newProduction.expirateDate,
          measurement: this.newProduction.measurement,
          quantityTotal: this.newProduction.quantityTotal,
          typeProduction:this.newProduction.typeProduction,
          stock:this.newProduction.stock
      
        }

        this.productionsService.updateProduction(Data, this.newProduction.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newProduction = {
              id: 0, typeProduction: '',
              stock: 0,
              measurement: '',
              description: '',
              quantityTotal: 0,
              expirateDate: new Date(),
              animalId: 0,
            };
            if (this.IdFarm !== null) {
              this.listProductions(this.IdFarm);
              
            }
            this.closeModal();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.productionsService.createProduction(this.newProduction).subscribe({
          next: () => {

            this.alertService.SuccessAlert('Creado correctamente ');
            form.reset();
            if (this.IdFarm !== null) {
              this.listProductions(this.IdFarm);
              
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
  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-') {
        event.preventDefault(); // Prevenir la entrada del símbolo de menos
    }
  }
  setDefaultSelections(): void {
    // Si hay toros disponibles, seleccionar el primero como valor predeterminado
    if (this.animales.length > 0) {
      this.newProduction.animalId = this.animales[0].id;
    }
    
  }

  
  resetForm(): void {
    this.newProduction = {
      id: 0, typeProduction: '',
      stock: 0,
      measurement: '',
      description: '',
      quantityTotal: 0,
      expirateDate: new Date(),
      animalId: 0,
    };
  }
  onEdit(production: Productions): void {
    this.newProduction = { ...production };
    if (this.newProduction.expirateDate) {
      const dateObj = new Date(this.newProduction.expirateDate);
      this.newProduction.expirateDate = dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.productionsService.deleteProduction(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Producción eliminada correctamente');
            if (this.IdFarm !== null) {
              this.listProductions(this.IdFarm);
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar producción');
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
