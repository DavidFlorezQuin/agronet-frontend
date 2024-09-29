
import { ContinentService } from './continent.service'; // Servicio para CRUD de continente
import { AlertService } from '../../../shared/components/alert.service';

import { Continent } from './Continent.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-continent',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule],
  templateUrl: './continent.component.html' // Cambia al template correspondiente
})
export class ContinentComponent implements OnInit {

  continents: Continent[] = [];
  newContinent: Continent = { id: 0, name: '', description: '' }; // Objeto de continente inicializado
  displayedColumns: string[]=['id','name', 'description', 'acciones'];
  dtoptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();
  dataSource!: MatTableDataSource<Continent>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private continentService: ContinentService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      lengthMenu: [5, 10, 15, 20]
    };

    this.listContinents(); // Llama a la función para obtener los continentes al iniciar
  }

  listContinents(): void {
    this.continentService.getContinent().subscribe({
      next: (res: Continent[]) => {
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.continents = res; // Asigna la respuesta a la lista de continentes
        this.dttrigger.next(null);
        this.dataSource.data = res;
      },
      error: () => {
        this.alertService.ErrorAlert('Algo salió mal al obtener los continentes');
      }
    });
  }

  onEdit(continent: Continent): void {
    this.newContinent = { ...continent }; // Copia el objeto para editarlo
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.continentService.deleteContinent(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Continente eliminado');
            this.listContinents();
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal al eliminar el continente');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newContinent.id) {
        // Actualiza un continente existente
        this.continentService.updateContinent(this.newContinent, this.newContinent.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Continente actualizado');
            form.reset();
            this.newContinent = { id: 0, name: '', description: '' }; // Reinicia el objeto
            this.listContinents();
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal al actualizar el continente');
          }
        });
      } else {
        // Crea un nuevo continente
        this.continentService.createContinent(this.newContinent).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Continente guardado');
            form.reset();
            this.listContinents();
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal al guardar el continente');
          }
        });
      }
    }else{
      this.alertService.ErrorAlert('Formulario inclompleto')
    }
  }

  aplicarFiltro(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }

  }

}
