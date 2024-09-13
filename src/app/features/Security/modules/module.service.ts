import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modulo } from './modulo.module';
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getModules(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this._baseUrl}/Modulo`);  
  }
  
  createModules(modulo: Modulo): Observable<Modulo> {
    return this.http.post<Modulo>(`${this._baseUrl}/Modulo`, modulo);
  }

  deleteModules(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Modulo/${id}`);
  }
  
  updateModules(modulo: Modulo, id: number): Observable<Modulo> {
    const url = `${this._baseUrl}/Modulo/${id}`; 
    return this.http.put<Modulo>(url, modulo);
  }
  
}

