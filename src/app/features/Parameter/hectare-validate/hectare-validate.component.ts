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
import { Hectarea } from './hectare-validate.module';
import { HectareaService } from './hectare-validate.service';

@Component({
  selector: 'app-hectare-validate',
  standalone: true,
  imports: [CommonModule, FormsModule,

    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './hectare-validate.component.html',
  styleUrl: './hectare-validate.component.css'
})
export class HectareValidateComponent {
  displayedColumns:string[] = ['id','TotalHectareas','FarmMaxHectareareas','acciones'];
  dataSource: MatTableDataSource<Hectarea> = new MatTableDataSource<Hectarea>();
  dtoptions: Config={};
  dttrigger: Subject<any>= new Subject<any>();
  hectarea: Hectarea[] = [];
  newHectarea: Hectarea = {id: 0,TotalHectareas:0, FarmMaxHectareareas:0 };

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    constructor(private hectareaService: HectareaService, private alertService: AlertService) {}

    ngOnInit(): void {

      this.dtoptions={
        pagingType:'ful_numbers',
        lengthMenu:[5,10,15,20]
      };
      this.listHectarea();
    }



  listHectarea(): void {
    this.hectareaService.getHectarea().subscribe({
      next: (res: Hectarea[])=>{
        this.dataSource= new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.hectarea = res;
        this.dttrigger.next(null);
        this.dataSource.data = res;
      },
      error: ()=>{
        this.alertService. ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(hectarea:Hectarea): void {
    this.newHectarea = {...hectarea};


  }

  onDelete(id:number): void {
    this.alertService.DeleteAlert().then((res)=>{
      if(res.isConfirmed){
        this.hectareaService.deleteHectarea(id).subscribe({
          next: ()=>{
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listHectarea();
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
      if(this.newHectarea.id>0){
        this.hectareaService.updateHectarea(this.newHectarea,this.newHectarea.id).subscribe({
          next: ()=>{
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newHectarea={id:0,TotalHectareas:0, FarmMaxHectareareas:0  };
              this.listHectarea();

          },
          error: ()=>{
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      }else{
        this.hectareaService.createHectarea(this.newHectarea).subscribe({
          next: ()=>{
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listHectarea();
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
