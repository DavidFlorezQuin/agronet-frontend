import { Injectable } from '@angular/core';
import { environment } from '../../../../env/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hectarea } from './hectare-validate.module';

@Injectable({
  providedIn: 'root'
})
export class HectareaService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getHectarea():Observable<Hectarea[]>{
    return this.http.get<Hectarea[]>(`${this._baseUrl}/HectareValidate`);
  }

  createHectarea(hectarea:Hectarea):Observable<Hectarea>{
    return this.http.post<Hectarea>(`${this._baseUrl}/HectareValidate`,hectarea)
  }

  deleteHectarea(id:number):Observable<void>{
    return this.http.delete<void>(`${this._baseUrl}/HectareValidate${id}`)
  }

  updateHectarea(hectarea:Hectarea, id:number):Observable<Hectarea>{
    const url = `${this._baseUrl}/HectareValidate/${id}`
    return this.http.put<Hectarea>(url,hectarea);
  }
}
