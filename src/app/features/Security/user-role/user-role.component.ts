import { Component, OnInit, ViewChild } from '@angular/core';
import { UserRole } from './UserRole.module';
import { UserRoleService } from './user-role.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AlertService } from '../../../shared/components/alert.service';
import { Role } from '../role/role.module';
import { RolesService } from '../role/roles.service';
import { User } from '../users/User.module';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from '../users/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [CommonModule, FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './user-role.component.html',
  styles: ``
})
export class UserRoleComponent implements OnInit {

  roles: Role[] = [];
  availableRoles: Role[] = [];

  newUserRoles: UserRole = { id: 0, RoleId: 0, UserId: 0 };

  displayedColumns: string[] = ['id', 'name', 'description', 'acciones'];
  dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>();

  selection = new SelectionModel<User>(true, []);
  currentUser: { id: number, name: string } = { id: 0, name: '' };

  newRole: Role = { id: 0,state:true, name: '', description: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private roleUserService: UserRoleService,
    private userService: UserService,
    private rolesService: RolesService,
    private serviceAlert: AlertService
  ) { }

  ngOnInit(): void {

    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.newUserRoles.UserId = user.id
    });

    this.listUserRole();

  }

  listUserRole():void{
    this.roleUserService.getUserRole(this.currentUser.id).subscribe({
      next: (res: Role[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.roles = res; 
      },
      error: (error) => {
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    })
  }
  

  resetForm(): void {
  }

 
  toggleSelection(user: User): void {
    this.selection.toggle(user);
  }

  updateUserRole(user: User): void {
    this.roleUserService.updateUserRoles(user).subscribe(() => {
      Swal.fire('Success', `Roles updated for ${user.username}`, 'success');
    }, error => {
      Swal.fire('Error', 'There was an error updating the roles', 'error');
    });
  }
  onEdit(role: Role): void {
  }

  onDelete(id:number):void{

  }
  onSubmit(form: NgForm): void {
  }


  aplicarFiltro(event: Event): void {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
