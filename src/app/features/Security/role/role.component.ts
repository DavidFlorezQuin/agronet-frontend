import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RolesService } from './roles.service';
import { CommonModule } from '@angular/common';
import { Role } from './role.module';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './role.component.html'
})
export class RoleComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'acciones'];
  dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  newRole: Role = { id: 0, name: '', description: '' };

  constructor(private rolesService: RolesService, private router: Router, private serviceAlert: AlertService) {}

  ngOnInit(): void {
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
            this.newRole = { id: 0, name: '', description: '' };
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
    }
  }

  onView(role: { id: number, name: string }): void {
    this.rolesService.changeRole(role);
    this.router.navigate(['dashboard/role-view']);
  }

  aplicarFiltro(event: Event): void {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
