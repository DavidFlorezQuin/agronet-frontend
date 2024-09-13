import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../env/enviroment';
import { Observable } from 'rxjs';
import { City } from './city.module';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getCity():Observable<City[]>{
    return this.http.get<City[]>(`${this._baseUrl}/City`)
  }

  createCity(city:City):Observable<City>{
    return this.http.post<City>(`${this._baseUrl}/City`, city)
  }

  updateCity(city:City, id:number):Observable<City>{
    return this.http.put<City>(`${this._baseUrl}/City/${id}`,city)
  }

  deleteCity(id:number):Observable<void>{
    return this.http.delete<void>(`${this._baseUrl}/City/${id}`)
  }

}
