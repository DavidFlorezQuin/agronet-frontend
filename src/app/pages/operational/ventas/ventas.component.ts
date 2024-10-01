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
import { Ventas } from './Ventas.module';
import { VentasService } from './ventas.service';

@Component({
  selector: 'app-ventas',
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
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit {
  newSale: Ventas = {
    id: 0,
    price: 0,
    quantity: 0,
    measurement: '',
    productionId: 0,
    currency: ''
  };

  sales: Ventas[] = [];
  displayedColumns: string[] = ['id', 'price', 'quantity', 'currency', 'acciones'];
  dataSource!: MatTableDataSource<Ventas>;


  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private salesService: VentasService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.listSales();
  }

  listSales(): void {
    this.salesService.getSales().subscribe({
      next: (res: Ventas[]) => {

        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sales = res;
        this.dataSource.data = res
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los registros de ventas');
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
            this.listSales();
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
            this.listSales();
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

  onEdit(sale: Ventas): void {
    this.newSale = { ...sale };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.salesService.deleteSale(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Registro eliminado correctamente');
            this.listSales();
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
