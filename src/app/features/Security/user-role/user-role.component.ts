import { Component, OnInit } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule, MatFormFieldModule,MatOptionModule],
  templateUrl: './user-role.component.html',
  styles: ``
})
export class UserRoleComponent implements OnInit {
  
  users: User[] = [];
  availableRoles: Role[] = [];
  displayedColumns: string[] = ['select', 'id', 'name', 'roles', 'action'];
  selection = new SelectionModel<User>(true, []);

  constructor(
    private roleUserService: UserRoleService, 
    private userService: UserService, 
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe(roles => {
      this.availableRoles = roles;
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.users.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.users.forEach(row => this.selection.select(row));
  }

  toggleSelection(user: User): void {
    this.selection.toggle(user);
  }

  onRoleChange(user: User): void {
    console.log('Roles updated for user:', user);
  }

  updateUserRole(user: User): void {
    this.roleUserService.updateUserRoles(user).subscribe(() => {
      Swal.fire('Success', `Roles updated for ${user.username}`, 'success');
    }, error => {
      Swal.fire('Error', 'There was an error updating the roles', 'error');
    });
  }
}
