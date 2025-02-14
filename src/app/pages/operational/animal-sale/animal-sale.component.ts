import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from '../../../shared/components/alert.service';
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
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatButtonModule } from '@angular/material/button';
import { DataTablesModule } from 'angular-datatables';
import { Modal } from 'bootstrap';
import { EnumService } from '../../../shared/components/enum.service';
import { ProductionsService } from '../produccion/produccion.service';
import { Productions } from '../produccion/produccion.module';
import { ElementRef } from '@angular/core';
import { VentasService } from '../ventas/ventas.service';
import { Ventas } from '../ventas/ventass.module';
import { AnimalSale } from './animal-sale.module';
import { VentasAnimalService } from './animale-sale.service';
import { Animal } from '../animal/animal.module';
import { AnimalService } from '../animal/animal.service';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-animal-sale',
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
  templateUrl: './animal-sale.component.html',
  styleUrl: './animal-sale.component.css'
})
export class AnimalSaleComponent {

  measurements: [] = [];
  animals: Animal[] = [];
  IdFarm: number | null = null; // Propiedad para almacenar el ID

  newSale: AnimalSale = {
    id: 0,
    price: 0,
    weight: '',
    animalsId: 0,
    currency: 0
  };
  productions: any[] = [];
  sales: AnimalSale[] = [];
  displayedColumns: string[] = ['id', 'animal', 'price', 'peso', 'acciones'];
  dataSource!: MatTableDataSource<Ventas>;

  @ViewChild('Modal') Modal!: ElementRef;
  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private salesService: VentasAnimalService, private alertService: AlertService, private enumController: EnumService, private productionsService: ProductionsService, private animalsServices: AnimalService) { }

  ngOnInit(): void {

    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); // Convertir a number
    } else {
      console.error('ID de la finca no válido o no presente en localStorage');
      this.IdFarm = null; // Si no hay ID, establecer a null
    }

    if (this.IdFarm !== null) {
      this.listSales(this.IdFarm);
      this.listAnimals(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }

    this.listMeasurement();
  }
  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-') {
      event.preventDefault(); // Prevenir la entrada del símbolo de menos
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

  isLoading: boolean = false;
  isData: boolean = false;
  listSales(IdFarm: number): void {
    this.salesService.getSales(IdFarm).subscribe({
      next: (res: any) => {

        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sales = data;
        this.dataSource.data = data
        this.isLoading = false;
        this.isData = data.lenght === 0;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los registros de ventas');
        this.isLoading = false;
      }
    });
  }
  listAnimals(IdFarm: number): void {
    this.animalsServices.getAnimals(IdFarm).subscribe({
      next: (res: any) => {

        const data = res.data;
        this.animals = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los registros de animales');
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
    doc.text('Histórico de ganado vendidos', 14, 23); // Título del PDF

    // Encabezados de la tabla
    const headers = [['id', 'Animal', 'Precio', 'Moneda', 'Peso']];

    // Datos de la tabla
    const data = this.sales.map(sales => [
      sales.id,
      sales.animals,
      sales.price,
      sales.currency,
      sales.weight
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
        4: { cellWidth: 20 }
      }
    });

    // Guardar el archivo PDF
    doc.save('ventas-animal.pdf');
  }

  downloadExcel() {
    // Crear un arreglo con los datos de los animales
    const bornlData = this.sales.map(sales => ({
      ID: sales.id,
      Nombre: sales.price,
      Dimensión: sales.weight,
      Descripción: sales.currency,
      Ciudad: sales.animals
    }));

    // Crear un libro de trabajo (workbook) y una hoja (worksheet)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(bornlData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ventas');

    // Exportar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'ventas.xlsx');
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
  // Función para cerrar el modal
  closeModal(): void {
    const modalElement = document.getElementById('ventaModal');
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
      if (this.newSale.id > 0) {
        this.salesService.updateSale(this.newSale, this.newSale.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Venta actualizada correctamente');
            form.reset();
            this.newSale = {
              id: 0,
              price: 0,
              weight: '',
              animalsId: 0,
              currency: 0
            };
            if (this.IdFarm !== null) {
              this.listSales(this.IdFarm);

            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
            this.closeModal();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar la venta');
          }
        });
      } else {
        this.salesService.createSale(this.newSale).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Venta registrada correctamente');
            form.reset();
            if (this.IdFarm !== null) {
              this.listSales(this.IdFarm);

            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
            this.closeModal();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al registrar la venta');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onEdit(sale: AnimalSale): void {
    this.newSale = { ...sale };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.salesService.deleteSale(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Registro eliminado correctamente');
            if (this.IdFarm !== null) {
              this.listSales(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar el registro');
          }
        });
      }
    });
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
