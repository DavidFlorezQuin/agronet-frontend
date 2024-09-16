import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { PersonService } from './person.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Person } from './person.module';
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

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './person.component.html',
  styles: []
})
export class PersonComponent implements OnInit {

  
  persons: Person[]= [];
  newPerson: Person = {id: 0, firstName:'',lastName:'',email:'',gender:'',document:'',typeDocument:'',direction:'',phone:'', birthday:'' }
displayedColumns: string[] = [ 'id', 'firstName', 'lastName', 'email', 'gender', 'document', 'direction', 'phone', 'birthday'];
  dataSource!: MatTableDataSource<Person>;
dtoptions: Config={};
dttrigger: Subject<any>= new Subject<any>();

// referenicas del paginador y sort
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
constructor(private personService: PersonService,private alertService: AlertService){}


  ngOnInit(): void {
    
    this.dtoptions={
      pagingType:'ful_numbers',
      lengthMenu:[5,10,15,20]
    };
    this.listPersons();
  }
 


listPersons(): void {
  this.personService.getPerson().subscribe({
    next: (res)=>{
      this.dataSource= new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.persons = res;
      this.dttrigger.next(null);
    },
    error: ()=>{
      this.alertService. ErrorAlert('Error al obtener los datos');
    }
  });
}

onEdit(person:Person): void {
  this.newPerson = {...person};
}

onDelete(id:number): void {
  this.alertService.DeleteAlert().then((res)=>{
    if(res.isConfirmed){
      this.personService.onDeletePerson(id).subscribe({
        next: ()=>{
          this.alertService.SuccessAlert('Eliminado correctamente');
          this.listPersons();
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
    if(this.newPerson.id>0){
      this.personService.updatePerson(this.newPerson,this.newPerson.id).subscribe({
        next: ()=>{
          this.alertService.SuccessAlert('Actualizado correctamente');
          form.reset();
          this.listPersons();
        },
        error: ()=>{
          this.alertService.ErrorAlert('Error al actualizar');
        }
      });
    }else{
      this.personService.createPerson(this.newPerson).subscribe({
        next: ()=>{
          this.alertService.SuccessAlert('Creado correctamente');
          form.reset();
          this.listPersons();
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
  }



}