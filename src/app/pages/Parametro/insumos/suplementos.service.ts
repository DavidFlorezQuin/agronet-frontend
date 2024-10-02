import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment';
import { Suplemento } from './suplementos.module';
@Injectable({
    providedIn: 'root'
  })
  export class SuplementoService {

    private _baseUrl = environment.apiBaseUrl;

    constructor(private http:HttpClient) { }

    getSuplemento(): Observable<Suplemento[]> {
      return this.http.get<Suplemento[]>(`${this._baseUrl}/Supplies/list`);
    }
    createuplemento(Supplies: Suplemento): Observable<Suplemento> {
      return this.http.post<Suplemento>(`${this._baseUrl}/Supplies`, Supplies);
    }

    deleteSuplemento(id: number): Observable<void> {
      return this.http.delete<void>(`${this._baseUrl}/Supplies/${id}`);
    }

    updateSuplemento(Supplies: Suplemento, id: number): Observable<Suplemento> {
      const url = `${this._baseUrl}/Supplies/${id}`;  // Incluye el id en la URL
      return this.http.put<Suplemento>(url, Supplies);
    }

  }
