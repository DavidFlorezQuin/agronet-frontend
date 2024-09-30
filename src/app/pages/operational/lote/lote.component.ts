
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, NgForm } from '@angular/forms';
import { LoteService } from './lote.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Lote } from './lote.module';
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lote',
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
  templateUrl: './lote.component.html',
  styleUrl: './lote.component.css'
})
export class LoteComponent implements OnInit {
  dataSource: MatTableDataSource<Lote> = new MatTableDataSource<Lote>();
  displayedColumns: string[] = ['id', 'Nombre', 'Hectarea', 'fincaId', 'acciones'];

  lote: Lote[] = [];
  newLote: Lote = {
    id: 0, name: '',hectare: 0,
    farmId: 0,

  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private loteService: LoteService, private alertaService: AlertService) { }
  ngOnInit(): void {

    this.listLot();
  }

  listLot(): void {

  this.loteService.getLote().subscribe({
    next: (Lot:Lote[]) => {
      this.dataSource = new MatTableDataSource(Lot);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.lote = Lot;
    },
    error: () => {
      this.alertaService.ErrorAlert('Error al obtener los datos');
    }
  });

  }
  onEdit(lot: Lote): void {
    this.newLote = { ...lot };
  }

  onDelete(id: number): void {
    this.alertaService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.loteService.deleteLote(id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Eliminado correctamente');
            this.listLot();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }

onSubmit(form: NgForm): void {
  if (form.valid) {
    if (this.newLote.id > 0) {
      this.loteService.updateLote(this.newLote, this.newLote.id).subscribe({
        next: () => {
          this.alertaService.SuccessAlert('Actualizado correctamente');
          form.reset();
          this.newLote={
            id: 0, name: '',hectare: 0,
            farmId: 0,
          };
          this.listLot();
        },
        error: () => {
          this.alertaService.ErrorAlert('Error al actualizar');
        }
      });
    } else {
      this.loteService.createLote(this.newLote).subscribe({
        next: () => {
          this.alertaService.SuccessAlert('Creado correctamente');
          form.reset();
          this.listLot();
        },
        error: () => {
          this.alertaService.ErrorAlert('Error al crear');
        }
      });
    }
  } else {
    this.alertaService.ErrorAlert('Por favor complete todos los campos');
  }
}

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
