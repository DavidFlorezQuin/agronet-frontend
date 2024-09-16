import { Component, OnInit } from '@angular/core';
import { City } from './city.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { CityService } from './city.service';
import { AlertService } from '../../../shared/components/alert.service';
import { NgForm } from '@angular/forms';
import { CountryService } from '../country/country.service';
import { Country } from '../country/Country.module';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [DataTablesModule, FormsModule],
  templateUrl: './city.component.html'
})
export class CityComponent implements OnInit{

  cities: City[] = []; 
  countries: Country[] = []; 

  newCity: City = {id:0, name:'', descripcion: '', countryId:0 }

  dtoptions: Config={}
  dttrigger: Subject<any> = new  Subject<any>();

  constructor(private serviceCity:CityService, private serviceAlert:AlertService, private countryService: CountryService){}

  ngOnInit(): void {
      this.dtoptions={
      pagingType: "full_numbers",
      lengthMenu: [5,10,15,20]
    };

  this.listCity();
  }

  listCity():void{
    this.serviceCity.getCity().subscribe({
      next: (res)=>{
        this.cities = this.cities; 
        this.dttrigger.next(null);
      }, 
      error: ()=>{
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    })
  }


  listCountries(): void {
    this.countryService.getCountry().subscribe({
      next: (contries: Country[]) => {
        this.countries = contries; // Asigna la respuesta a la lista de países
        this.dttrigger.next(null);
      },
      error: () => {
        this.serviceAlert.ErrorAlert('Algo salió mal al obtener los países');
      }
    });
  }
  onEdit(city: City):void{
    this.newCity = {...city}
  }

  onDelete(id:number):void{
    this.serviceAlert.DeleteAlert().then((res)=>{
      if(res.isConfirmed){
        this.serviceCity.deleteCity(id).subscribe({
          next: (res)=>{
            this.serviceAlert.SuccessAlert('Eliminado ')
            this.listCity();
          }, 
          error:()=>{
            this.serviceAlert.ErrorAlert('algo salió mal')
          }
        })
      }
    })
  }

  onSubmit(form:NgForm){
    if(form.valid){
      if(this.newCity.id){
        this.serviceCity.updateCity(this.newCity, this.newCity.id).subscribe({
            next: (res) =>{
              this.serviceAlert.SuccessAlert('Actualizado ');
              form.reset();
              this.newCity = {id:0, name:'', descripcion: '', countryId:0 }
              this.listCity();
            }, 
            error: (err)=>{
              this.serviceAlert.ErrorAlert('Algo salió mal')
            }
        })
      } else{
        this.serviceCity.createCity(this.newCity).subscribe({
          next: ()=>{
            this.serviceAlert.SuccessAlert('Guardado ')
            form.reset(); 
            this.listCity(); 
          }, 
          error: ()=>{
            this.serviceAlert.ErrorAlert('Algo salió mal')
          }
        })
      }
    }
  }

}
