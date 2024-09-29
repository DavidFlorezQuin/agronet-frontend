import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment';
import { CategoriaSuplemento } from './categoria-suplemento.module';
@Injectable({
    providedIn: 'root'
  })
  export class CategoriaSuplementoService {

    private _baseUrl = environment.apiBaseUrl;

    constructor(private http:HttpClient) { }

    getCategoriaSuplemento(): Observable<CategoriaSuplemento[]> {
      return this.http.get<CategoriaSuplemento[]>(`${this._baseUrl}/CategorySupplies/list`);
    }
    createCategoriaSuplemento(CategoriaSuplemento: CategoriaSuplemento): Observable<CategoriaSuplemento> {
      return this.http.post<CategoriaSuplemento>(`${this._baseUrl}/CategorySupplies`, CategoriaSuplemento);
    }

    deleteCategoriaSuplemento(id: number): Observable<void> {
      return this.http.delete<void>(`${this._baseUrl}/CategorySupplies/${id}`);
    }

    updateCategoriaSuplemento(CategoriaSuplemento: CategoriaSuplemento, id: number): Observable<CategoriaSuplemento> {
      const url = `${this._baseUrl}/CategorySupplies/${id}`;  // Incluye el id en la URL
      return this.http.put<CategoriaSuplemento>(url, CategoriaSuplemento);
    }

  }
