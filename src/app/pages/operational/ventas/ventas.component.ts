import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SalesService } from './sales.service';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit {
  newSale: Sales = {
    id: 0,
    price: 0,
    quantity: 0,
    measurement: '',
    productionId: 0,
    production: { id: 0, typeProduction: '' },
    currency: ''
  };

  sales: Sales[] = [];

  constructor(private salesService: SalesService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.listSales();
  }

  listSales(): void {
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los registros de ventas');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newSale.id > 0) {
        this.salesService.updateSale(this.newSale).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Venta actualizada correctamente');
            form.reset();
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

  onEdit(sale: Sales): void {
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

}
