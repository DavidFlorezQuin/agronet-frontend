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
import { Suplemento } from './suplementos.module';
import { SuplementoService } from './suplementos.service';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-suplementos',
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
  templateUrl: './suplementos.component.html',
  styleUrls: ['./suplementos.component.css']
})
export class SuplementosComponent {
 displayedColumns:string[] = ['id','name','gender','weight','photo','race','purpuse','birthDay', 'LotId','state'];
  dataSource: MatTableDataSource<Suplemento> = new MatTableDataSource<Suplemento>();
  dtoptions: Config={};
  dttrigger: Subject<any>= new Subject<any>();
  Suplemento: Suplemento[] = [];
  newSuplemento: Suplemento = {id: 0, Name:'',CategorySuppliesId:0,Description:'' };

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    constructor(private SuplementoService: SuplementoService, private alertaService: AlertService) {}

    ngOnInit():void{
      this.dtoptions={
        pagingType:'ful_numbers',
        lengthMenu:[5,10,15,20]
      };
  this.ListAnimal();
    }

ListAnimal(): void{
      this.SuplementoService.getSuplemento().subscribe({
  next:(Suplemento:Suplemento[])=>{
    this.dataSource= new MatTableDataSource(Suplemento);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.Suplemento = Suplemento;
    this.dttrigger.next(null);
    this.dataSource.data = Suplemento;
  }
      });
      error:()=>{
        this.alertaService.ErrorAlert('Error al obtener los animales');
      }
    }
    //ng generate component pages/about

  aplicarFiltro(event:Event): void{

  const filterValue=(event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  onEdit(Suplemento:Suplemento): void{
  this.newSuplemento={...Suplemento};
  }

  eliminar(id:number): void{
  this.alertaService.DeleteAlert().then((res)=>{
    if(res.isConfirmed){
      this.SuplementoService.deleteSuplemento(id).subscribe({
        next:(res)=>{
          this.alertaService.SuccessAlert('Eliminado con éxito');
          this.ListAnimal();
        },
        error:()=>{
          this.alertaService.ErrorAlert('Error al eliminar el animal');
        }
      });
    }
  });

  }

  onSubmit(form:NgForm):void{
  if(form.valid){
    if(this.newSuplemento.id>0){
      this.SuplementoService.updateSuplemento(this.newSuplemento,this.newSuplemento.id).subscribe({
        next:()=>{
          this.alertaService.SuccessAlert('Actualizado correctamente');
          form.reset();
          this.ListAnimal();
              },
              error:()=>{
                this.alertaService.ErrorAlert('Error al actualizar');
              }
      });
    }else{
      this.SuplementoService.createuplemento(this.newSuplemento).subscribe({
        next:()=>{
          this.alertaService.SuccessAlert('Creado correctamente');
          form.reset();
          this.ListAnimal();
        },
        error:()=>{
          this.alertaService.ErrorAlert('Error al crear');

        }
      });
    }
  }else{
    this.alertaService.ErrorAlert('Por favor completa todod los campos');

  }
  }

}
