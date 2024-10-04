import { Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '../../../shared/components/alert.service';
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
import { InventarioSuplemento } from './inventario-suplemento.module';
import { InventarioSuplementoService } from './inventario-suplemento.service';
import { Inventories } from '../inventario/Inventories.module';
import { InventoriesService } from '../inventario/inventario.service';
import { Suplemento } from '../../Parametro/insumos/suplementos.module';
import { SuplementoService } from '../../Parametro/insumos/suplementos.service';
@Component({
  selector: 'app-inventario-suplemento',
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
  templateUrl: './inventario-suplemento.component.html',
  styleUrl: './inventario-suplemento.component.css'
})
export class InventarioSuplementoComponent implements OnInit {
  newInventarioSuplemento: InventarioSuplemento = {
    id: 0,
    amount: 0,
    measure: 0,
    inventoryId: 0,
    suppliesId: 0,


  };
  Suplemento: Suplemento[] = [];
  Inventario: Inventories[] = [];
  InventarioSuplemento: InventarioSuplemento[] = [];
  displayedColumns: string[] = [
    'id',
    'amount',
    'measure',
    'inventoryId',
    'suppliesId',
    'acciones'];

  dataSource!: MatTableDataSource<InventarioSuplemento>;

  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private inventarioSuplementoService: InventarioSuplementoService,
    private alertService: AlertService,
    private inventarioService: InventoriesService,
    private suplementoService: SuplementoService) { }




  ngOnInit(): void {

    this.listInventarioSuplemento();
    this.listInventario();
    this.listSuplemento();
  }

  listInventarioSuplemento(): void {
    this.inventarioSuplementoService.getInventarioSuplemento().subscribe({
      next: (res: any) => {
        const data = res.data
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.InventarioSuplemento = data;
        this.dataSource.data = data;

      },
      error: (error) => {
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
  }


  listInventario(): void {
    this.inventarioService.getInventories().subscribe({
      next: (inventarios: Inventories[]) => {
        this.Inventario = inventarios;
      },
      error: (error) => {
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
  }

  listSuplemento(): void {
    this.suplementoService.getSuplemento().subscribe({
      next: (Suplemento: Suplemento[]) => {
        this.Suplemento = Suplemento;
      },
      error: (err) => {
        console.log(err);
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newInventarioSuplemento.id > 0) {
        this.inventarioSuplementoService.updateInventarioSuplemento(this.newInventarioSuplemento, this.newInventarioSuplemento.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newInventarioSuplemento = {
              id: 0,
              amount: 0,
              measure: 0,
              inventoryId: 0,
              suppliesId: 0,
            };
            this.listInventarioSuplemento();

          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.inventarioSuplementoService.createInventarioSuplemento(this.newInventarioSuplemento).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listInventarioSuplemento();
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

  onEdit(InventarioSuplemento: InventarioSuplemento): void {
    this.newInventarioSuplemento = { ...InventarioSuplemento };


  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.inventarioSuplementoService.deleteInventarioSuplemento(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Producción eliminada correctamente');
            this.listInventarioSuplemento();
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
