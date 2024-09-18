
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { NacimetoService } from './nacimiento.service'; 
import { AlertService } from '../../../shared/components/alert.service';
import { Nacimiento } from './nacimiento.module'; 
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Config } from 'datatables.net';
import { FormsModule } from '@angular/forms';
import { error } from 'jquery';

@Component({
  selector: 'app-nacimiento',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './nacimiento.component.html',
  styleUrl: './nacimiento.component.css'
})
export class NacimientoComponent implements OnInit{
  

  nacimiento: Nacimiento []=[];
  newNacimiento: Nacimiento ={
    id:0, 
    Assistence:'', Result:0,
     Description:'',
    BirthWeight:0, 
    Inseminacionid:'',AnimalId: 0,
    Animal:{id:0,name:'',gender:'',
      weight:0,photo:'',raceId:0,purpose:'',
      birthDay: new Date(),state:true,LotId:0}

  };
displayedColumns: string[]=['id','Assistence','Result','Description','BirthWeight','Inseminacionid','AnimalId','Animal'];
dtoptions: Config={};
dttrigger: Subject<any>= new Subject<any>();
dataSource: MatTableDataSource<Nacimiento>=new MatTableDataSource<Nacimiento>();
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

constructor(private nacimientoService:NacimetoService, private alertaService:AlertService){}

ngOnInit(): void {
  this.dtoptions={
    pagingType:'full_number',
    lengthMenu:[5,10,15,20]
  }

}

ListNacimiento():void{
this.nacimientoService.getNacimiento().subscribe({
  next:(nacimientoss)=>{
    this.nacimientoService;
    this.dataSource.data=nacimientoss;
    this.dataSource.paginator=this.paginator;
    this.dataSource.sort=this.sort;

  }
});
error:()=>{
  this.alertaService.ErrorAlert('Error al obtener los datos de nacimiento')
}

}

aplicarFiltro(event:Event): void{

  const filterValue=(event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  
  }

  onEdit(nacimiento:Nacimiento):void{
    this.newNacimiento={...nacimiento};
  }
  /**
   * Handles the editing of a nacimiento object.
   *
   * This function takes a Nacimiento object as a parameter and copies its properties to the newNacimiento object.
   * This allows for editing the nacimiento object in the component's UI.
   *
   * @param nacimiento - The Nacimiento object to be edited.
   * @returns {void} - This function does not return any value.
   */

  eliminar(id:number):void {
    this.alertaService.DeleteAlert().then((res)=>{
      if(res.isConfirmed){
        this.nacimientoService.deleteNacimiento(id).subscribe({
          next:(res)=>{ 
            this.alertaService.SuccessAlert('Eliminado con éxito');
            this.ListNacimiento();
          },
          error:()=>{
            this.alertaService.ErrorAlert('Error al eliminar el animal');
          }
        });
      }
    });
  }
  
editar(form:NgForm):void {
  if (form.valid){ 
    if(this.newNacimiento.id>0){
      this.nacimientoService.updateNacimiento(this.newNacimiento,this.newNacimiento.id).subscribe({
        next:()=>{
          this.alertaService.SuccessAlert('Actualizado con éxito');
          form.reset();
           this.ListNacimiento;
        },
        error:()=>{
          this.alertaService.ErrorAlert('Error al actualizar el animal');
        }
      });
    }
    }else{
      this.alertaService.ErrorAlert('Por favor, complete los datos requeridos');
    }

}

onSubmit(form:NgForm):void{
  if(form.valid){
    if(this.newNacimiento.id>0){
      this.nacimientoService.updateNacimiento(this.newNacimiento,this.newNacimiento.id).subscribe({
        next:()=>{
          this.alertaService.SuccessAlert('Actualizado correctamente');
          form.reset();
          this.ListNacimiento();
              },
              error:()=>{
                this.alertaService.ErrorAlert('Error al actualizar');
              }
      });
    }else{
      this.nacimientoService.createNacimiento(this.newNacimiento).subscribe({
        next:()=>{
          this.alertaService.SuccessAlert('Creado correctamente');
          form.reset();
          this.ListNacimiento;
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
