import { Injectable } from '@angular/core';
import { environment } from '../../../../env/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from './departament.module';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getDepartamento():Observable<Departamento[]>{
    return this.http.get<Departamento[]>(`${this._baseUrl}/Departament`);
  }

  createDepartamento(departamento:Departamento):Observable<Departamento>{
    return this.http.post<Departamento>(`${this._baseUrl}/Departament`,departamento)
  }

  deleteDepartamento(id:number):Observable<void>{
    return this.http.delete<void>(`${this._baseUrl}/Departament${id}`)
  }

  updateDepartamento(departamento:Departamento, id:number):Observable<Departamento>{
    const url = `${this._baseUrl}/Departament/${id}`
    return this.http.put<Departamento>(url,departamento);
  }
}
