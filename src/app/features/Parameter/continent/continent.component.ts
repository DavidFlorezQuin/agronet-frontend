import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { ContinentService } from './continent.service'; // Servicio para CRUD de continente
import { AlertService } from '../../../shared/components/alert.service';
import { NgForm } from '@angular/forms';
import { Continent } from './Continent.module';

@Component({
  selector: 'app-continent',
  standalone: true,
  imports: [],
  templateUrl: './continent.component.html' // Cambia al template correspondiente
})
export class ContinentComponent implements OnInit {
  
  continents: Continent[] = []; 
  newContinent: Continent = { id: 0, name: '', description: '' }; // Objeto de continente inicializado

  dtoptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();

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
      next: (res) => {
        this.continents = res; // Asigna la respuesta a la lista de continentes
        this.dttrigger.next(null);
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
    }
  }
}
