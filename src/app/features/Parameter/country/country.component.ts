import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { CountryService } from './country.service'; // Servicio para CRUD de país
import { AlertService } from '../../../shared/components/alert.service';
import { NgForm } from '@angular/forms';
import { Country } from './Country.module';
import { Continent } from '../continent/Continent.module';
import { ContinentService } from '../continent/continent.service';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [],
  templateUrl: './country.component.html' // Cambia al template correspondiente
})
export class CountryComponent implements OnInit {

  countries: Country[] = []; 
  continents: Continent[] = []; 
  newCountry: Country = { id: 0, name: '',  countryCode:'', continentId: 0 }; // Objeto de país inicializado

  dtoptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();

  constructor(private countryService: CountryService, private alertService: AlertService, private continentService: ContinentService) {}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      lengthMenu: [5, 10, 15, 20]
    };

    this.listCountries(); // Llama a la función para obtener los países al iniciar
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

  listCountries(): void {
    this.countryService.getCountry().subscribe({
      next: (contries: Country[]) => {
        this.countries = contries; // Asigna la respuesta a la lista de países
        this.dttrigger.next(null);
      },
      error: () => {
        this.alertService.ErrorAlert('Algo salió mal al obtener los países');
      }
    });
  }

  onEdit(country: Country): void {
    this.newCountry = { ...country }; // Copia el objeto para editarlo
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.countryService.deleteCountry(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('País eliminado');
            this.listCountries();
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal al eliminar el país');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newCountry.id) {
        // Actualiza un país existente
        this.countryService.updateCountry(this.newCountry, this.newCountry.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('País actualizado ');
            form.reset();
            this.newCountry = { id: 0, name: '',  countryCode:'', continentId: 0 }; // Objeto de país inicializado
            this.listCountries();
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal al actualizar el país');
          }
        });
      } else {
        // Crea un nuevo país
        this.countryService.createCountry(this.newCountry).subscribe({
          next: () => {
            this.alertService.SuccessAlert('País guardado');
            form.reset();
            this.listCountries();
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal al guardar el país');
          }
        });
      }
    }
  }
}