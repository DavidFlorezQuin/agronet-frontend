import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
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
import { CategoriaSuplemento } from './categoria-suplemento.module';
import { CategoriaSuplementoService } from './categoria-suplemento.service';
import { DataTablesModule } from 'angular-datatables';
@Component({
  selector: 'app-categoria-suplemento',standalone: true,
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
   MatSortModule
  ],
  templateUrl: './categoria-suplemento.component.html',
  styleUrls: ['./categoria-suplemento.component.css']
})
export class CategoriaSuplementoComponent implements OnInit{

  newCategoriaSuplemento: CategoriaSuplemento={id:0, Name:'',Description:''}
  displayedColumns: string[] = [ 'id','Name','Description','color','Acciones']
  CategoriaSuplemento: CategoriaSuplemento[]= [];
 dataSource!: MatTableDataSource<CategoriaSuplemento>;
 dtoptions: Config={};
 dttrigger: Subject<any>= new Subject<any>();

 // referenicas del paginador y sort
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;
 constructor(private alertService:AlertService, private CategoriaSuplementoService:CategoriaSuplementoService){}
 ngOnInit(): void {

   this.dtoptions={
     pagingType:'ful_numbers',
     lengthMenu:[5,10,15,20]
   };
   this.listCategoriaAlerta();
 }
 listCategoriaAlerta(): void {
   this.CategoriaSuplementoService.getCategoriaSuplemento().subscribe({
     next: (res: CategoriaSuplemento[])=>{
       this.dataSource= new MatTableDataSource(res);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
       this.CategoriaSuplemento = res;
       this.dttrigger.next(null);
       this.dataSource.data = res;
     },
     error: ()=>{
       this.alertService. ErrorAlert('Error al obtener los datos');
     }
   });
 }

 onEdit(CategoriaSuplemento:CategoriaSuplemento): void {
   this.newCategoriaSuplemento  = {...CategoriaSuplemento};


 }

 onDelete(id:number): void {
   this.alertService.DeleteAlert().then((res)=>{
     if(res.isConfirmed){
       this.CategoriaSuplementoService.deleteCategoriaSuplemento(id).subscribe({
         next: ()=>{
           this.alertService.SuccessAlert('Eliminado correctamente');
           this.listCategoriaAlerta();
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
     if(this.newCategoriaSuplemento.id>0){
       this.CategoriaSuplementoService.updateCategoriaSuplemento(this.newCategoriaSuplemento,this.newCategoriaSuplemento.id).subscribe({
         next: ()=>{
           this.alertService.SuccessAlert('Actualizado correctamente');
           form.reset();
           this.newCategoriaSuplemento={id:0, Name:'',Description:'' };
             this.listCategoriaAlerta();

         },
         error: ()=>{
           this.alertService.ErrorAlert('Error al actualizar');
         }
       });
     }else{
       this.CategoriaSuplementoService.createCategoriaSuplemento(this.newCategoriaSuplemento).subscribe({
         next: ()=>{
           this.alertService.SuccessAlert('Creado correctamente');
           form.reset();
           this.listCategoriaAlerta();
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
