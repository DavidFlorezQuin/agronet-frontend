import { Component } from '@angular/core';
import { Animal } from './animal.module';

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
import { AnimalService } from './animal.service';
@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './animal.component.html',
  styleUrl: './animal.component.css'
})
export class AnimalComponent {
displayedColumns:string[] = ['id','animal','gender','weight','photo','race','purpuse','birthDay','dateRegister', 'acciones'];
dataSource: MatTableDataSource<Animal> = new MatTableDataSource<Animal>();
dtoptions: Config={};
dttrigger: Subject<any>= new Subject<any>();
  animales: Animal[] = [];
  newAnimales: Animal = {id: 0, animal:'',gender:'',weight:0,photo:'',race:'',purpose:'',birthDay: new Date(),dateRegister: new Date(),LotId: 0 };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private animalService: AnimalService, private alertaService: AlertService) {}

  ngOnInit():void{
    this.dtoptions={
      pagingType:'ful_numbers',
      lengthMenu:[5,10,15,20]
    };
this.ListAnimal();
  }
  ListAnimal(): void{
    this.animalService.getAnimals().subscribe({
next:(animals)=>{
  this.animales=animals;
  this.dataSource.data =animals;
  this.dataSource.paginator=this.paginator;
  this.dataSource.sort=this.sort;
}
    });
    error:()=>{
      this.alertaService.ErrorAlert('Error al obtener los animales');
    }
  }

aplicarFiltro(event:Event): void{

const filterValue=(event.target as HTMLInputElement).value;
this.dataSource.filter = filterValue.trim().toLowerCase();

}

onEdit(animal:Animal): void{
this.newAnimales={...animal};
}

eliminar(id:number): void{
this.alertaService.DeleteAlert().then((res)=>{
  if(res.isConfirmed){
    this.animalService.deleteAnimal(id).subscribe({
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
editar(form:NgForm):void{
  if (form.valid){ 
  if(this.newAnimales.id>0){
    this.animalService.updateAnimal(this.newAnimales,this.newAnimales.id).subscribe({
      next:()=>{
        this.alertaService.SuccessAlert('Actualizado con éxito');
        form.reset();
         this.ListAnimal();
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


  


}
