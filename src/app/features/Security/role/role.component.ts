import { Component,OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule, NgForm } from '@angular/forms';
import { RolesService } from './roles.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Role } from './role.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './role.component.html'
})
export class RoleComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'acciones'];
  dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  newRole: Role = { id: 0,state:true, name: '', description: '' };
  dtoptions: Config={};
  dttrigger: Subject<any>= new Subject<any>();

  constructor(private rolesService: RolesService, private serviceAlert: AlertService) {}

  ngOnInit(): void {
    this.dtoptions={
      pagingType:'ful_numbers',
      lengthMenu:[5,10,15,20]}
    this.listRole();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  listRole(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.dataSource.data = roles;
      },
      error: () => {
        this.serviceAlert.ErrorAlert('Algo salió mal');
      }
    });
  }

  onEdit(role: Role): void {
    this.newRole = { ...role };
  }

  onDelete(id: number): void {
    this.serviceAlert.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.rolesService.deleteRole(id).subscribe({
          next: () => {
            this.serviceAlert.SuccessAlert('Eliminado');
            this.listRole();
          },
          error: () => {
            this.serviceAlert.ErrorAlert('Algo salió mal');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newRole.id) {
        this.rolesService.updateRole(this.newRole, this.newRole.id).subscribe({
          next: () => {
            this.serviceAlert.SuccessAlert('Actualizado');
            form.reset();
            this.newRole = { id: 0, state:true, name: '', description: '' };
            this.listRole();
          },
          error: () => {
            this.serviceAlert.ErrorAlert('Algo salió mal');
          },
        });
      } else {
        this.rolesService.createRole(this.newRole).subscribe({
          next: () => {
            this.serviceAlert.SuccessAlert('Guardado con éxito!');
            form.reset();
            this.listRole();
          },
          error: () => {
            this.serviceAlert.ErrorAlert('Algo salió mal');
          }
        });
      }
    }else{
      this.serviceAlert.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onView(role: { id: number, name: string }): void {
    this.rolesService.changeRole(role);
    //this.rolesService.router.navigate(['dashboard/role-view']);
  }

  aplicarFiltro(event: Event): void {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
