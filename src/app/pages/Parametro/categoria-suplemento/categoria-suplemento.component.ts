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
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { AlertService } from '../../../shared/components/alert.service';

import { MatButtonModule } from '@angular/material/button';
import { DataTablesModule } from 'angular-datatables';
import { CategoriaSuplemento } from './categoria-suplemento.module';
import { CategoriaSuplementoService } from './categoria-suplemento.service';

@Component({
  selector: 'app-categoria-suplemento',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTablesModule,CommonModule,FormsModule,
    MatIconModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './categoria-suplemento.component.html',
  styleUrl: './categoria-suplemento.component.css'
})
export class CategoriaSuplementoComponent implements OnInit{
  CategoriaSuplemento:CategoriaSuplemento[] = [];
dtoptions: Config={};
 dttrigger: Subject<any>= new Subject<any>();
 newCategorySuplemento: CategoriaSuplemento={
  id: 0,
  Name: '',
  Description: ''
 
 };
 displayedColumns: string[] = ['id', 'Name', 'Description','CategorySupplies', 'Acciones']
 // referenicas del paginador y sort
 dataSource!: MatTableDataSource<CategoriaSuplemento>;

 // referenicas del paginador y sort
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

 constructor(private alertService:AlertService, private categoriaSuplementoService:CategoriaSuplementoService){}
 ngOnInit(): void {

  this.listCategoriaMedicina();
}
listCategoriaMedicina(): void {
  this.categoriaSuplementoService.getCategorySuplemento().subscribe({
    next: (res: any) => {
      const data = res.data; 
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.categoriaSuplementoService = data;
      this.dataSource.data = data;
    },
    error: () => {
      this.alertService.ErrorAlert('Error al obtener los datos');
    }
  });
}

onEdit(CategorySuplemento: CategoriaSuplemento): void {
  this.newCategorySuplemento = { ...CategorySuplemento};


}

onDelete(id: number): void {
  this.alertService.DeleteAlert().then((res) => {
    if (res.isConfirmed) {
      this.categoriaSuplementoService.onDeleteCategorySuplemento(id).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Eliminado correctamente');
          this.listCategoriaMedicina();
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
    if (this.newCategorySuplemento.id > 0) {
      this.categoriaSuplementoService.updateCategorySuplemento(this.newCategorySuplemento, this.newCategorySuplemento.id).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Actualizado correctamente');
          form.reset();
          this.newCategorySuplemento = { id: 0,
            Name: '',
            Description: ''};
          this.listCategoriaMedicina();

        },
        error: () => {
          this.alertService.ErrorAlert('Error al actualizar');
        }
      });
    } else {
      this.categoriaSuplementoService.createCategorySuplemento(this.newCategorySuplemento).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Creado correctamente');
          form.reset();
          this.listCategoriaMedicina();
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

aplicarFiltro(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

}
