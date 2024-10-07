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

@Component({
  selector: 'app-produccion',
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
  templateUrl: './produccion.component.html'
})
export class ProduccionComponent implements OnInit {

  farmId:number = 2; 
  newProduction: Productions = {
    id: 0,
    typeProduction: '',
    stock: 0,
    measurement: '',
    description: '',
    quantityTotal: 0,
    expirateDate: new Date(),
    animal:'',
    animalId: 0,

  };
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
    'accions']

    dataSource!: MatTableDataSource<Productions>;

  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private productionsService: ProductionsService, private animalService: AnimalService, private alertService: AlertService) { }

  ngOnInit(): void {

    this.listProductions(this.farmId);
    // this.listAnimales();
  }

  listProductions(farmId:number): void {
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

  downloadPDF(){
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
      productions.animal


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

  // listAnimales(): void {
  //   this.animalService.getAnimals().subscribe({
  //     next: (Animales: Animal[]) => {
  //       this.animales = Animales;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //       this.alertService.ErrorAlert('Error al cargar los medicamentos');
  //     }
  //   });
  // }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newProduction.id > 0) {
        this.productionsService.updateProduction(this.newProduction, this.newProduction.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newProduction = { id: 0, typeProduction:'',
              stock: 0,
              animal:'',
              measurement: '',
              description: '',
              quantityTotal: 0,
              expirateDate: new Date(),
              animalId: 0, };
            this.listProductions(this.farmId);

          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.productionsService.createProduction(this.newProduction).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listProductions(this.farmId);
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

  onEdit(production: Productions): void {
    this.newProduction = { ...production };


  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.productionsService.deleteProduction(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Producción eliminada correctamente');
            this.listProductions(this.farmId);
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
