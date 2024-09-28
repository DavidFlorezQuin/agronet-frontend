import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { SuppliesService } from './supplies.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Supplies } from './supplies.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-supplies',
  templateUrl: './supplies.component.html',
  styles: []
})
export class SuppliesComponent implements OnInit {

  supplies: Supplies[] = [];
  newSupply: Supplies = {
    id: 0, name: '', description: '', amount: 0, input_type: '', date: new Date()
  };

  dtoptions: DataTables.Settings = {};
  dttrigger: Subject<any> = new Subject<any>();

  constructor(private suppliesService: SuppliesService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      lengthMenu: [5, 10, 15, 20]
    };
    this.listSupplies();
  }

  listSupplies(): void {
    this.suppliesService.getSupplies().subscribe({
      next: (res) => {
        this.supplies = res;
        this.dttrigger.next(null);
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(supply: Supplies): void {
    this.newSupply = { ...supply };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.suppliesService.deleteSupply(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listSupplies();
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
      if (this.newSupply.id > 0) {
        this.suppliesService.updateSupply(this.newSupply, this.newSupply.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.listSupplies();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.suppliesService.createSupply(this.newSupply).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listSupplies();
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
}
