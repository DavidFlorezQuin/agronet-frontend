
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { FincaService } from './finca.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Finca } from './finca.module';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Config } from 'datatables.net';
import { City } from '../../../features/Parameter/city/city.module';
import { CityService } from '../../../features/Parameter/city/city.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../features/Security/users/User.module';
import { UserService } from '../../../features/Security/users/user.service';

@Component({
  selector: 'app-finca',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './finca.component.html',
  styleUrl: './finca.component.css'
})
export class FincaComponent implements OnInit {
 //definicion de cities
  cities: City[]=[];
users: User[]=[];
  fincas: Finca[] = [];
  newFinca: Finca = { id: 0,
     name: '',
     dimension: 0,
     description: '',
     userId: 0,
     cityId: 0}

  displayedColumns: string[] = ['id', 'name', 'dimension', 'description', 'cityName', 'userName', 'acciones'];
  dataSource!: MatTableDataSource<Finca>;
  dtoptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private fincaService: FincaService, private alertService: AlertService,private cityService: CityService,private userService: UserService) { }

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      lengthMenu: [5, 10, 15, 20]
    };
    this.listFincas();
    this.loadCities();
    this.loadUsers();
  }
//llama la lista de usuarios
  loadUsers(): void{
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los usuarios');
      }
    });
  }
//llama la lista de ciudades
  loadCities(): void {
    this.cityService.getCity().subscribe({
      next: (cities) => {
        // Maneja la lista de ciudades
        console.log('Cities:', cities);
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener las ciudades');
      }
    });
  }

  listFincas(): void {
    this.fincaService.getFincas().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.fincas = res;
        this.dttrigger.next(null);
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(finca: Finca): void {
    this.newFinca = { ...finca };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.fincaService.deleteFinca(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listFincas();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newFinca.id > 0) {
        this.fincaService.updateFinca(this.newFinca, this.newFinca.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.listFincas();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.fincaService.createFinca(this.newFinca).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listFincas();
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
  }

}
