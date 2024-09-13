import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { Person } from './person.module';
import { PersonService } from './person.service';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTablesModule],
  templateUrl: './person.component.html',
  styles: ``
})
export class PersonComponent implements OnInit {
  dtoptions: Config={}
  dttrigger: Subject<any> = new  Subject<any>();

  persons: any[] = [];
  newPerson: Person = { id:0, firstName:'', lastName:'', email:'', gender:'',document:'',typeDocument:'', direction:'', phone:'', birthday: new Date}

  constructor(private personService: PersonService, private serviceAlert: AlertService){}

  ngOnInit(): void {

    this.dtoptions={
      pagingType: "full_numbers",
      lengthMenu: [5,10,15,20]
    };

this.onListPerson();

  }

  onListPerson():void{
    this.personService.getPerson().subscribe({
      next: (persons: Person[])=>{
        this.persons = persons; 
        this.dttrigger.next(null);
      }, 
      error: (err) => {
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    })
  }

  onSubmit(form: NgForm):void{
    if(form.valid){
      if(this.newPerson.id){
        this.personService.updatePerson(this.newPerson, this.newPerson.id).subscribe({
           next:(res)=>{
            this.serviceAlert
            form.reset();
            this.newPerson = { id:0, firstName:'', lastName:'', email:'', gender:'',document:'',typeDocument:'', direction:'', phone:'', birthday: new Date}
            this.onListPerson();
          }
        })
      } else {
        this.personService.createPerson(this.newPerson).subscribe({
          next:(res) => {
            this.serviceAlert.SuccessAlert('Guardado con éxito!')
            form.reset();
            this.onListPerson();
          }, 
          error: (err) =>{
            this.serviceAlert.ErrorAlert('Algo salió mal')
            
          }
        })
      }
    }
  }
}
