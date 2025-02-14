import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { FincaService } from './finca.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Finca } from './finca.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CityService } from '../../../features/Parameter/city/city.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../features/Security/users/user.service';
import { MatButtonModule } from '@angular/material/button';
import { DataTablesModule } from 'angular-datatables';
import jsPDF from 'jspdf';
import { City } from '../../../features/Parameter/city/city.module';
import { FarmUserService } from '../finca-usuario/finca-usuario.service';
import { FarmUser } from '../finca-usuario/finca-usuario.module';
import { ViewChild, ElementRef } from '@angular/core';
declare var bootstrap: any;
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-finca',
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
  templateUrl: './finca.component.html'
})
export class FincaComponent implements OnInit {

  usuarioId: number | null = null;

  IdUser: number | null = null;
  fincas: Finca[] = [];
  newFinca: Finca = {
    id: 0,
    City: '',
    code: '',
    name: '',
    photo: '',
    hectare: 0,
    description: '',
    cityId: 0,
    state: true
  }

  displayedColumns: string[] = ['id', 'name', 'hectare', 'description', 'cityId', 'state', 'acciones'];
  dataSource!: MatTableDataSource<Finca>;
  City: City[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(private fincaService: FincaService, private alertService: AlertService, private cityService: CityService, private userFarmService: FarmUserService) { }

  ngOnInit(): void {

    const StorageId: string | null = localStorage.getItem('Usuario');
    this.usuarioId = StorageId ? Number(StorageId) : null;

    if (StorageId && !isNaN(Number(StorageId))) {
      this.IdUser = Number(StorageId);
    }

    if (this.IdUser !== null) {
      this.listFincas(this.IdUser);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
    this.loadCities();
  }

  //llama la lista de ciudades
  loadCities(): void {
    this.cityService.getCity().subscribe({
      next: (cities: City[]) => {
        this.City = cities;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener las ciudades');
      }
    });
  }
  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-') {
      event.preventDefault(); // Prevenir la entrada del símbolo de menos
    }
  }

  isLoading: boolean = false;
  isData: boolean = false;
  listFincas(IdFarm: number): void {
    this.isLoading = true; // Inicia la carga
    this.fincaService.getFincas(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.fincas = data;
        this.dataSource.data = data;
        this.isLoading = false; 
        this.isData = data.lenght === 0; 
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
        this.isLoading = false;
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
    doc.text('Histórico de fincas', 14, 23); // Título del PDF

    // Encabezados de la tabla
    const headers = [['id', 'name', 'hectare', 'description', 'cityId']];

    // Datos de la tabla
    const data = this.fincas.map(fincas => [
      fincas.id,
      fincas.name,
      fincas.hectare,
      fincas.description,
      fincas.City
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
        3: { cellWidth: 80 },
        4: { cellWidth: 20 },
      }
    });

    // Guardar el archivo PDF
    doc.save('fincas.pdf');
  }

  onEdit(finca: Finca): void {
    this.newFinca = { ...finca };
  }
  downloadExcel() {
    // Crear un arreglo con los datos de los animales
    const bornlData = this.fincas.map(fincas => ({
      ID: fincas.id,
      Nombre: fincas.name,
      Dimensión: fincas.hectare,
      Descripción: fincas.description,
      Ciudad: fincas.City,
      Estado: fincas.state
    }));

    // Crear un libro de trabajo (workbook) y una hoja (worksheet)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(bornlData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'fincas');

    // Exportar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'fincas.xlsx');
  }
  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.fincaService.deleteFinca(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');

            if (this.IdUser !== null) {
              this.listFincas(this.IdUser);
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
    if (form.valid) {
      const formData = form.value;
      const fincaData: Finca = {
        ...formData,
        id: this.newFinca.id,
        code: this.newFinca.code,
        name: this.newFinca.name,
        photo: this.newFinca.photo,
        hectare: this.newFinca.hectare,
        description: this.newFinca.description,
        cityId: this.newFinca.cityId,
        state: this.newFinca.state
      };
      if (this.newFinca.id > 0) {
        this.fincaService.updateFinca(fincaData, this.newFinca.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            if (this.IdUser !== null)
              this.listFincas(this.IdUser);
          },
          error: () => this.alertService.ErrorAlert('Error al actualizar')
        });
      } else {
        const formData = form.value;
        const fincaToCreate: Finca = { ...formData, id: 0, code: '' };

        if (this.IdUser !== null) {
          this.fincaService.createFinca(fincaToCreate, this.IdUser).subscribe({
            next: (response: any) => {
              this.alertService.SuccessAlert('Finca creada correctamente');
              form.reset();
              if (this.IdUser !== null) {
                this.listFincas(this.IdUser);
              }
            },
            error: () => this.alertService.ErrorAlert('Error al crear finca')
          });
        }
      }

    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onPhotoChange(event: any): void {
    const file = event.target.files[0]; // Tomamos el primer archivo seleccionado
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.newFinca.photo = reader.result as string; // Guardamos el resultado en base64
      };
      reader.readAsDataURL(file); // Leemos el archivo como base64
    }
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetForm(): void {
    this.newFinca = {
      id: 0,
      code: '',
      City: '',
      name: '',
      photo: '',
      hectare: 0,
      description: '',
      cityId: 0,
      state: true
    }
  }

}
