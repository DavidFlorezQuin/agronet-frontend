import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from '../../../shared/components/alert.service';
import { NgForm } from '@angular/forms';
import { FarmUser } from './finca-usuario.module';
import { FarmUserService } from './finca-usuario.service';
import { User } from '../../../features/Security/users/User.module';
import { UserService } from '../../../features/Security/users/user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import { Finca } from '../finca/finca.module';
import { FincaService } from '../finca/finca.service';
import { ViewChild, ElementRef } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-finca-usuario',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    DataTablesModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './finca-usuario.component.html',
  styleUrl: './finca-usuario.component.css'
})
export class FincaUsuarioComponent implements OnInit {

  farmUsers: FarmUser[] = [];
  newFarmUser: FarmUser = { id: 0, farmsId: 0, UsersId: 0, farm: '', users: ''};
  displayedColumns: string[] = ['farmName', 'userName', 'acciones'];
  dataSource!: MatTableDataSource<FarmUser>;
  
  farms: Finca[] = [];
  users: User[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(private fincaService: FincaService,private farmUserService: FarmUserService,private userService:UserService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.listFarmUsers();
    // this.loadFarms();
    this.loadUsers();
  }

  listFarmUsers(): void {
    this.farmUserService.getFarmUsers().subscribe({
      next: (res: FarmUser[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.farmUsers = res;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener las relaciones');
      }
    });
  }

  
  // loadFarms(): void {
  //   this.fincaService.getFincas().subscribe({
  //     next: (Fincas: Finca[]) => {
  //       this.farms=Fincas;
  //     },
  //     error: (error)=>{
  //       console.log(error);
  //       this.alertService.ErrorAlert('Error al cargar');
  //     }
  //   });    }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (Usuario: User[]) => {
        this.users=Usuario;
      },
      error: (error)=>{
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar ');
      }
    });  
  
  }

  onEdit(farmUser: FarmUser): void {
    this.newFarmUser = { ...farmUser };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then(res => {
      if (res.isConfirmed) {
        this.farmUserService.deleteFarmUsers(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listFarmUsers();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }
  onView(farmUser: FarmUser): void {
    // Aquí puedes abrir un modal o mostrar los detalles de alguna otra manera.
    this.newFarmUser = { ...farmUser };
    const modal = document.getElementById('viewFarmUserModal');
    if (modal) {
      modal.style.display = 'block'; // Mostrar el modal
    }
  }
  
  closeViewModal(): void {
    const modal = document.getElementById('viewFarmUserModal');
    if (modal) {
      modal.style.display = 'none'; // Cerrar el modal
    }
  }
   // Función para cerrar el modal
   closeModal(): void {
    const modal = new bootstrap.Modal(this.Modal.nativeElement);  // Usar la referencia del modal
    modal.hide();  // Cerrar el modal
  }
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newFarmUser.id > 0) {
        this.farmUserService.updateFarmUsers(this.newFarmUser, this.newFarmUser.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.resetForm();
            this.newFarmUser = { id: 0, farmsId: 0, UsersId: 0, farm: '', users: ''};;
            this.listFarmUsers();
            this.closeModal();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.farmUserService.createFarmUsers(this.newFarmUser).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.resetForm();
            this.listFarmUsers();
            this.closeModal();
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

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
