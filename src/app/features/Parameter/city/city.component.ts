import { Component, OnInit, ViewChild } from '@angular/core';
import { City } from './city.module';
import { Country } from '../country/Country.module';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { CityService } from './city.service';
import { CountryService } from '../country/country.service';
import { AlertService } from '../../../shared/components/alert.service';
import { NgForm } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './city.component.html',
  styles: []
})
export class CityComponent implements OnInit {

  cities: City[] = [];
  countries: Country[] = [];
  newCity: City = { id: 0, name: '', descripcion: '', countryId: 0 };

  dtoptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cityService: CityService,
    private alertService: AlertService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: "full_numbers",
      lengthMenu: [5, 10, 15, 20]
    };

    this.listCities();
    this.listCountries();
  }

  listCities(): void {
    this.cityService.getCity().subscribe({
      next: (res: City[]) => {
        this.cities = res;
        this.dttrigger.next(null);
      },
      error: () => {
        this.alertService.ErrorAlert('Algo salió mal al obtener las ciudades');
      }
    });
  }

  listCountries(): void {
    this.countryService.getCountry().subscribe({
      next: (countries: Country[]) => {
        this.countries = countries;
        this.dttrigger.next(null);
      },
      error: () => {
        this.alertService.ErrorAlert('Algo salió mal al obtener los países');
      }
    });
  }

  onEdit(city: City): void {
    this.newCity = { ...city };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.cityService.deleteCity(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Ciudad eliminada correctamente');
            this.listCities();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar la ciudad');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newCity.id > 0) {
        this.cityService.updateCity(this.newCity, this.newCity.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Ciudad actualizada correctamente');
            form.reset();
            this.newCity = { id: 0, name: '', descripcion: '', countryId: 0 };
            this.listCities();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar la ciudad');
          }
        });
      } else {
        this.cityService.createCity(this.newCity).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Ciudad creada correctamente');
            form.reset();
            this.listCities();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear la ciudad');
          }
        });
      }
    }
  }

}
