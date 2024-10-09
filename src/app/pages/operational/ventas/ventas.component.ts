import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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

import { MatButtonModule } from '@angular/material/button';
import { DataTablesModule } from 'angular-datatables';

import { VentasService } from './ventas.service';
import { Ventas } from './ventass.module';
import { EnumService } from '../../../shared/components/enum.service';
import { ProductionsService } from '../produccion/produccion.service';
import { Productions } from '../produccion/produccion.module';
@Component({
  selector: 'app-ventas',
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
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit {

  measurements: [] = [];
  IdFarm: number | null = null; // Propiedad para almacenar el ID

  newSale: Ventas = {
    id: 0,
    price: 0,
    quantity: 0,
    measurement: '',
    productionId: 0,
    currency: ''
  };
  productions: Productions[] = [];
  sales: Ventas[] = [];
  displayedColumns: string[] = ['id', 'price', 'quantity', 'production', 'currency', 'acciones'];
  dataSource!: MatTableDataSource<Ventas>;


  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private salesService: VentasService, private alertService: AlertService, private enumController:EnumService, private productionsService:ProductionsService) { }

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
      this.listProductions(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }

    this.listMeasurement();
  }

  listSales(IdFarm:number): void {
    this.salesService.getSales(IdFarm).subscribe({
      next: (res: any) => {

        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sales = data;
        this.dataSource.data = data
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los registros de ventas');
      }
    });
  }
  downloadPDF(){
  }

  listProductions(farmId: number): void {
    this.productionsService.getProductions(farmId).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.productions = data;
      },
      error: (error) => {
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
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
              quantity: 0,
              measurement: '',
              productionId: 0,
              currency: ''
            };
            if (this.IdFarm !== null) {
              this.listSales(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }          },
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
            }          },
          error: () => {
            this.alertService.ErrorAlert('Error al registrar la venta');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onEdit(sale: Ventas): void {
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
            }          },
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
