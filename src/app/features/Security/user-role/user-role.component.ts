import { Component, OnInit } from '@angular/core';
import { UserRole } from './UserRole.module';
import { UserRoleService } from './user-role.service';
import { UserService } from '../users/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AlertService } from '../../../shared/components/alert.service';
import { Role } from '../role/role.module';
import { RolesService } from '../role/roles.service';

@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-role.component.html',
  styles: ``
})
export class UserRoleComponent implements OnInit {


  userRole: any[] = [];
  roles: any[] = [];
  newUserRole: UserRole = { id: 0, RoleId: 0, UserId: 0}


  currentUser: { id: number, name: string } = { id: 0, name: '' };

  constructor(private serviceUserRole: UserRoleService, private serviceUser: UserService, private serviceRole: RolesService, private serviceAlert: AlertService) { }
  ngOnInit(): void {
    this.serviceUser.currentUser.subscribe(user => {
      this.currentUser = user;
      this.newUserRole.UserId = user.id
    });
    this.listUserRole();
    this.listRole();
  }

  listRole(): void {
    this.serviceRole.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles
      },
      error: (err) => {
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    })
  }

  listUserRole(): void {
    this.serviceUserRole.getUserRole(this.currentUser.id).subscribe({
      next: (userRole: UserRole[]) => {
        this.userRole = userRole;
      },
      error: (err) => {
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    })
  }



  onDelete(id: number): void {
   this.serviceAlert.DeleteAlert().then((res)=>{
    if(res.isConfirmed){
      this.serviceRole.deleteRole(id).subscribe({
        next:(res)=>{
          this.serviceAlert.SuccessAlert('Eliminado con éxito')
        },
        error:()=>{
          this.serviceAlert.ErrorAlert('Algo salió mal')
        }
      })
    }
   })
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.newUserRole.id) {
        this.serviceUserRole.updateUserRole(this.newUserRole, this.newUserRole.id).subscribe({
          next: (res) => {
            this.serviceAlert.SuccessAlert('Actualizado con éxito!')
            form.reset();
            this.newUserRole = { id: 0, RoleId: 0, UserId: 0 };
            this.listUserRole();
          }
        })
      } else {
        this.serviceUserRole.createUserRole(this.newUserRole).subscribe({
          next: (res) => {
            this.serviceAlert.SuccessAlert('Guardado con éxito!')
            form.reset();
            this.listUserRole();
          },
          error: (err) => {
            this.serviceAlert.ErrorAlert('Algo salió mal')

          }
        })
      }
    }
  }

}
