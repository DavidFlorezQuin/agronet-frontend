import { Component,OnInit } from '@angular/core';

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
import { Departamento } from './departament.module';
import { DepartamentoService } from './departament.service';

@Component({
  selector: 'app-departament',
  standalone: true,
  imports: [CommonModule, FormsModule,

    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './departament.component.html',
  styleUrl: './departament.component.css'
})
export class DepartamentComponent implements OnInit{

  displayedColumns:string[] = ['id','name','gender','weight','photo','race','purpuse','birthDay', 'LotId','state'];
dataSource: MatTableDataSource<Departamento> = new MatTableDataSource<Departamento>();
dtoptions: Config={};
dttrigger: Subject<any>= new Subject<any>();
departamento: Departamento[] = [];
newDepartamento: Departamento = {id: 0,code:'', name:'',CountryId:0 };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private departamentoService: DepartamentoService, private alertService: AlertService) {}

  ngOnInit(): void {

    this.dtoptions={
      pagingType:'ful_numbers',
      lengthMenu:[5,10,15,20]
    };
    this.listDepartamento();
  }



listDepartamento(): void {
  this.departamentoService.getDepartamento().subscribe({
    next: (res: Departamento[])=>{
      this.dataSource= new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.departamento = res;
      this.dttrigger.next(null);
      this.dataSource.data = res;
    },
    error: ()=>{
      this.alertService. ErrorAlert('Error al obtener los datos');
    }
  });
}

onEdit(departamento:Departamento): void {
  this.newDepartamento = {...departamento};


}

onDelete(id:number): void {
  this.alertService.DeleteAlert().then((res)=>{
    if(res.isConfirmed){
      this.departamentoService.deleteDepartamento(id).subscribe({
        next: ()=>{
          this.alertService.SuccessAlert('Eliminado correctamente');
          this.listDepartamento();
        },
        error: ()=>{
          this.alertService.ErrorAlert('Error al eliminar');
        }
      });
    }
  });
}

onSubmit(form:NgForm): void{
  if(form.valid){
    if(this.newDepartamento.id>0){
      this.departamentoService.updateDepartamento(this.newDepartamento,this.newDepartamento.id).subscribe({
        next: ()=>{
          this.alertService.SuccessAlert('Actualizado correctamente');
          form.reset();
          this.newDepartamento={id:0,code:'', name:'',CountryId:0  };
            this.listDepartamento();

        },
        error: ()=>{
          this.alertService.ErrorAlert('Error al actualizar');
        }
      });
    }else{
      this.departamentoService.createDepartamento(this.newDepartamento).subscribe({
        next: ()=>{
          this.alertService.SuccessAlert('Creado correctamente');
          form.reset();
          this.listDepartamento();
        },
        error: ()=>{
          this.alertService.ErrorAlert('Error al crear');
        }
      });
    }
  }else{
    this.alertService.ErrorAlert('Por favor complete todos los campos');
  }

}

aplicarFiltro(event:Event){
  const filterValue = (event.target as HTMLInputElement).value;
this.dataSource.filter =filterValue.trim().toLowerCase();

if (this.dataSource.paginator) {
  this.dataSource.paginator.firstPage();
}
}


}
