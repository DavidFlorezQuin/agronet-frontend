import { CommonModule } from '@angular/common';

import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Component,OnInit, ViewChild } from '@angular/core';
import { animalDiagnostico } from './animal-diagnostico.module';
import { User } from '../../../features/Security/users/User.module';
import { UserService } from '../../../features/Security/users/user.service';
import { Role } from '../../../features/Security/role/role.module';
import { AnimalService } from '../animal/animal.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { Animal } from '../animal/animal.module';
import { AnimalDiagnosticoService } from './animal-diagnostico.service';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-animal-diagnostico',
  standalone: true,
  imports: [CommonModule, FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule],
  templateUrl: './animal-diagnostico.component.html',
  styleUrl: './animal-diagnostico.component.css'
})
export class AnimalDiagnosticoComponent implements OnInit {
user :User[]=[];
animal: Animal[]=[];
AnimalDiagnostico: animalDiagnostico[]=[];
newAnimalDiagnostico: animalDiagnostico={id:0, Diagnosis:'',AnimalId:0,UsersId:0};
displayedColumns: string[] = ['id', 'Diagnostico', 'Animal', 'Users','acciones'];

dataSource!: MatTableDataSource<animalDiagnostico>; 
dtoptions: Config={};
dttrigger: Subject<any>= new Subject<any>();
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
constructor(private alertaService: AlertService , private animalService: AnimalService, private userService:UserService, private animalDiagnosticoService:AnimalDiagnosticoService){}

  ngOnInit(): void {
    this.dtoptions={
      pagingType:'ful_numbers',
      lengthMenu:[5,10,15,20]
    };
    this.listAnimal();
    this.listUser();
  }

listAnimalDiagnostico(): void {
  this.animalDiagnosticoService.getAnimalDiagnostico().subscribe({
    next: (animalDiagnostico: animalDiagnostico[]) => {
      this.AnimalDiagnostico = animalDiagnostico;
      this.dataSource = new MatTableDataSource(animalDiagnostico);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    error: () => {
      this.alertaService.ErrorAlert('Error al obtener los diagnosticos');
    }
  });
}

  listUser():void{
this.userService.getUsers().subscribe({
  next:(users: User[])=>{
   
    this.user=users;
  }
      });
      error:()=>{
        this.alertaService.ErrorAlert('Error al obtener los usuarios');
      }
  
  }


  listAnimal():void{

    this.animalService.getAnimals().subscribe({
      next:(animals: Animal[])=>{
       
        this.animal=animals;
      }
          });
          error:()=>{
            this.alertaService.ErrorAlert('Error al obtener los animales');
          }
  }
  onDelete(id: number): void {
    this.alertaService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.animalDiagnosticoService.deleteAnimalDiagnostico(id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Eliminado correctamente');
            this.listAnimalDiagnostico();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newAnimalDiagnostico.id > 0) {
        this.animalDiagnosticoService.updateAnimalDiagnostico(this.newAnimalDiagnostico, this.newAnimalDiagnostico.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newAnimalDiagnostico = { id:0, Diagnosis:'',AnimalId:0,UsersId:0};
            this.listAnimalDiagnostico();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.animalDiagnosticoService.createAnimalDiagnostico(this.newAnimalDiagnostico).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listAnimalDiagnostico();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al crear');
          }
        });
      }
    } else {
      this.alertaService.ErrorAlert('Por favor complete todos los campos');
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
