import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '../../../shared/components/alert.service';
import { AnimalDiagnosticsService } from './animal-diagnostico.service'; 
import { AnimalService } from '../animal/animal.service';
import { UserService } from '../../../features/Security/users/user.service'; 
import { Animal } from '../animal/animal.module';
import { User } from '../../../features/Security/users/User.module'; 
import { AnimalDiagnostics } from './animal-diagnostico.module';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-animal-diagnostico',
  standalone: true,
  imports: [CommonModule, 
    FormsModule,
    DataTablesModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './animal-diagnostico.component.html',
  styleUrl: './animal-diagnostico.component.css'
})
export class AnimalDiagnosticoComponent implements OnInit {

  diagnostics: AnimalDiagnostics[] = [];
  animales: Animal[] = [];
  usuarios: User[] = [];

  newDiagnostic: AnimalDiagnostics = {
    id: 0, diagnosis: '', animalId: 0, usersId: 0,
    
  };

  displayedColumns: string[] = ['diagnosis', 'animal', 'users', 'acciones'];
  dataSource!: MatTableDataSource<AnimalDiagnostics>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private diagnosticsService: AnimalDiagnosticsService,
    private animalService: AnimalService,
    private usersService: UserService,
    private alertaService: AlertService
  ) { }

  ngOnInit(): void {
    this.listDiagnostics();
    this.listAnimals();
    this.listUsers();
  }

  listDiagnostics(): void {
    this.diagnosticsService.getAnimalDiagnostics().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.diagnostics = data;
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los diagnósticos');
      }
    });
  }

  listAnimals(): void {
    this.animalService.getAnimals().subscribe({
      next: (res: any) => {
        this.animales = res.data;
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los animales');
      }
    });
  }

  listUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (res: any) => {
        this.usuarios = res.data;
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los usuarios');
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newDiagnostic.id > 0) {
        this.diagnosticsService.updateAnimalDiagnostics(this.newDiagnostic, this.newDiagnostic.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.listDiagnostics();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.diagnosticsService.createAnimalDiagnostics(this.newDiagnostic).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listDiagnostics();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al crear');
          }
        });
      }
    }
  }

  onDelete(id: number): void {
    this.alertaService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.diagnosticsService.deleteAnimalDiagnostics(id).subscribe({
          next: (res) => {
            this.alertaService.SuccessAlert('Eliminado con éxito');
            this.listDiagnostics();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al eliminar el animal');
          }
        });
      }
    });

  }

  

}
