import { Injectable } from '@angular/core';
import { environment } from '../../../../env/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from './Country.module';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private _baseUrl = environment.apiBaseUrl;
  
  constructor(private http:HttpClient) { }

  getCountry():Observable<Country[]>{
    return this.http.get<Country[]>(`${this._baseUrl}/Country/List`);
  }

  createCountry(country:Country):Observable<Country>{
    return this.http.post<Country>(`${this._baseUrl}/Country`,country)
  }

  deleteCountry(id:number):Observable<void>{
    return this.http.delete<void>(`${this._baseUrl}/Country${id}`)
  }

  updateCountry(country:Country, id:number):Observable<Country>{
    const url = `${this._baseUrl}/Country/${id}`
    return this.http.put<Country>(url,country);
  }
}
