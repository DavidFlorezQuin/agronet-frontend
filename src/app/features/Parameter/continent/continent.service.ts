import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../env/enviroment';
import { Observable } from 'rxjs';
import { Continent } from './Continent.module';

@Injectable({
  providedIn: 'root'
})
export class ContinentService {

  private _baseUrl = environment.apiBaseUrl; 
  constructor(private http:HttpClient) { }

  getContinent():Observable<Continent[]>{
    return this.http.get<Continent[]>(`${this._baseUrl}/Continent`)
  }

  createContinent(continent:Continent):Observable<Continent>{
    return this.http.post<Continent>(`${this._baseUrl}/Continent`,continent);
  }

  deleteContinent(id:number):Observable<void>{
    return this.http.delete<void>(`${this._baseUrl}/Continent/${id}`)
  }

  updateContinent(continent:Continent, id:number):Observable<Continent>{
    return this.http.put<Continent>(`${this._baseUrl}/Continent/${id}`,continent)
  }
}
