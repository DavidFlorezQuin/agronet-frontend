import { Component, OnInit } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../shared/components/alert.service';
import { NgModule } from '@angular/core';
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
import { state } from '@angular/animations';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import { InventarioHistoriaService } from './inventario-historia.service'; 
import { InventarioHistoria } from './inventario-historia.module'; 
import { User } from '../../../features/Security/users/User.module';
import { InventarioSuplemento } from '../inventario-suplemento/inventario-suplemento.module';
import { UserService } from '../../../features/Security/users/user.service';
import { InventarioSuplementoService } from '../inventario-suplemento/inventario-suplemento.service';
@Component({
  selector: 'app-inventario-historia',
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
    MatSortModule],
  templateUrl: './inventario-historia.component.html',
  styleUrls: ['./inventario-historia.component.css']
})
export class InventarioHistoriaComponent implements OnInit{
InventarioHistoria:InventarioHistoria[] = [];
newInventarioHistorias: InventarioHistoria = {
  id: 0, 
  date:  new Date(), 
  amount: 0,
  measure: 0,
  transactionType: '',
  UserId: 0, 
  InventorySuppliesId: 0,
};
displayedColumns: string[] = ['id', 'date', 'amount', 'measure', 'transactionType', 'UserId', 'InventorySuppliesId', 'acciones'];
User:User[] = [];
InventorySupplies:InventarioSuplemento[] = [];
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatPaginator) paginator!: MatPaginator;
dataSource!: MatTableDataSource<InventarioHistoria>;
constructor(private InventarioHistoriaService: InventarioHistoriaService, private alertService: AlertService,
  private userService: UserService, private inventarioSuplementoService: InventarioSuplementoService
 ){}
ngOnInit(): void {  
  this.ListinventarioHistoria();
 
}
ListinventarioHistoria(): void {
  this.InventarioHistoriaService.getInventarioHistoria().subscribe({
    next: (res: any) => {
      const data = res.data; 
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.InventarioHistoriaService = data; 
      this.dataSource.data = data;
    },
    error: () => {
      this.alertService.ErrorAlert('Error al obtener los animales');
    }
  });
}

listUsuario(): void {
  this.userService.getUsers().subscribe({
    next: (user: User[]) => {
      this.User=user;
    },
    error: (error)=>{
      console.log(error);
      this.alertService.ErrorAlert('Error al cargar los medicamentos');
    }
  });
}

listInventarioSuplemento(): void {
  this.inventarioSuplementoService.getInventarioSuplemento().subscribe({
    next: (InventarioSuplemento: InventarioSuplemento[]) => {
      this.InventorySupplies=InventarioSuplemento;
    },
    error: (error)=>{
      console.log(error);
      this.alertService.ErrorAlert('Error al cargar los medicamentos');
    }
  });
}

onSubmit(form: NgForm): void {
  if (form.valid) {
    if (this.newInventarioHistorias.id > 0) {
      this.InventarioHistoriaService.updateInventarioHistoria(this.newInventarioHistorias, this.newInventarioHistorias.id).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Actualizado correctamente');
          form.reset();
          this.newInventarioHistorias = { id: 0, 
            date:  new Date(), 
            amount: 0,
            measure: 0,
            transactionType: '',
            UserId: 0, 
            InventorySuppliesId: 0, };
          this.ListinventarioHistoria();

        },
        error: () => {
          this.alertService.ErrorAlert('Error al actualizar');
        }
      });
    } else {
      this.InventarioHistoriaService.createInventarioHistoria(this.newInventarioHistorias).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Creado correctamente');
          form.reset();
          this.ListinventarioHistoria();
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

onEdit(InventarioHistoria: InventarioHistoria): void {
  this.newInventarioHistorias = { ...InventarioHistoria };


}

onDelete(id: number): void {
  this.alertService.DeleteAlert().then((res) => {
    if (res.isConfirmed) {
      this.InventarioHistoriaService.deleteInventarioHistoria(id).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Producción eliminada correctamente');
          this.ListinventarioHistoria();
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
