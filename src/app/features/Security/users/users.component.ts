import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { UserService } from './user.service';
import { AlertService } from '../../../shared/components/alert.service';
import { User } from './User.module';
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

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,FormsModule,
    MatIconModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './users.component.html',
  styles: [`
    .action-icon {
      cursor: pointer;
      font-size: 1.2rem;
    }
  `]
})
export class UsersComponent implements OnInit {

  user: User[]= [];
  newUser: User = {
    id: 0,
    username: '',
    PersonId: 0,
    password: '',
  }
  displayedColumns: string[] = ['id', 'personName','personaid','contraseñas', 'acciones'];

  dataSource!: MatTableDataSource<User>;
dtoptions: Config={};
dttrigger: Subject<any>= new Subject<any>();

// referenicas del paginador y sort
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
constructor(private userService: UserService,private alertService: AlertService){}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      lengthMenu: [5, 10, 15, 20]
    };
    this.listUsers();


  }

  // Obtener la lista de usuarios
 listUsers():void{
    this.userService.getUsers().subscribe({
      next: (res: User[])=>{

        this.dataSource= new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log('Usuarios recibidos:', res);
      },
      error: ()=>{
        this.alertService. ErrorAlert('Error al obtener los datos');
      }
    });
  }


  onEdit(user: User): void {
    this.newUser = { ...user, password: user.password || '' };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado');
            this.listUsers();
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal');
          }
        });
      }
    });
  }


  onView(role: { id: number, name: string }): void {
    this.userService.changeUser(role);
    //this.rolesService.router.navigate(['dashboard/role-view']);
  }
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newUser.id > 0) {
        this.userService.updateUser(this.newUser, this.newUser.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.listUsers();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.userService.createUser(this.newUser).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listUsers();
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







