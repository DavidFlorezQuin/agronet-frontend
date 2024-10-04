import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule, NgForm } from '@angular/forms';

import { AlertService } from '../../../shared/components/alert.service';
import { Inventories } from './Inventories.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { InventoriesService } from './inventario.service';
import { Finca } from '../finca/finca.module';
import { FincaService } from '../finca/finca.service';
import { DataTablesModule } from 'angular-datatables';
@Component({
  selector: 'app-inventario',
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
  templateUrl: './inventario.component.html'
})
export class InventarioComponent implements OnInit {
  newInventory: Inventories = {
    id: 0,
    name: '',
    description: '',
    farmId: 0,

  };

  inventories: Inventories[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'farmId', 'acciones'];
  dataSource!: MatTableDataSource<Inventories>;
  finca: Finca[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private inventoriesService: InventoriesService, private alertService: AlertService, private fincaService: FincaService) { }

  ngOnInit(): void {
    this.listInventories();
    this.listFinca();
  }

  listInventories(): void {
    this.inventoriesService.getInventories().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.inventories = data;
        this.dataSource.data = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener inventarios');
      }
    });
  }

  listFinca(): void {
    this.fincaService.getFincas().subscribe({
      next: (res: Finca[]) => {


        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos de las fincas');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newInventory.id > 0) {
        this.inventoriesService.updateInventory(this.newInventory, this.newInventory.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Inventario actualizado correctamente');
            form.reset();
            this.listInventories();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar inventario');
          }
        });
      } else {
        this.inventoriesService.createInventory(this.newInventory).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Inventario creado correctamente');
            form.reset();
            this.listInventories();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear inventario');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onEdit(inventory: Inventories): void {
    this.newInventory = { ...inventory };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.inventoriesService.deleteInventory(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Inventario eliminado correctamente');
            this.listInventories();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar inventario');
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
