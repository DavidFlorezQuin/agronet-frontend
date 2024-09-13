import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './User.module';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, DataTablesModule],
  templateUrl: './users.component.html',
  styles: ``
})
export class UsersComponent implements OnInit {

  dtoptions: Config={}
  dttrigger: Subject<any> = new  Subject<any>();

  users:any[]=[];
  
  constructor(private serviceUser:UserService, private router: Router, private serviceAlert: AlertService){}

  ngOnInit(): void {

    this.dtoptions={
      pagingType: "full_numbers",
      lengthMenu: [5,10,15,20]
    };
      this.getUsers();
  }

  getUsers():void{
    this.serviceUser.getUsers().subscribe({
      next:(users:User[])=>{
        this.users = users
        this.dttrigger.next(null);
      },
      error:(error)=>{
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    });
  }


  onView(user: {id: number, name:string}): void{
    this.serviceUser.changeUser(user);
    this.router.navigate(['/user-role'])
  }


  onEdit(id:number):void{
    
  }
}
