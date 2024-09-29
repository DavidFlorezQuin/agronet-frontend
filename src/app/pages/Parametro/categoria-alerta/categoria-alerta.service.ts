import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment';
import { CategoriaAlerta } from './categoria-alerta.module';
@Injectable({
    providedIn: 'root'
  })
  export class CategoriaAlertaaService {

    private _baseUrl = environment.apiBaseUrl;

    constructor(private http:HttpClient) { }

    getCategoriaAlerta(): Observable<CategoriaAlerta[]> {
      return this.http.get<CategoriaAlerta[]>(`${this._baseUrl}/CategoryAlert/list`);
    }
    createCategoriaAlerta(CategoriaAlerta: CategoriaAlerta): Observable<CategoriaAlerta> {
      return this.http.post<CategoriaAlerta>(`${this._baseUrl}/CategoriaAlert`, CategoriaAlerta);
    }

    deleteCategoriaAlerta(id: number): Observable<void> {
      return this.http.delete<void>(`${this._baseUrl}/CategoriaAlert/${id}`);
    }

    updateCategoriaAlerta(CategoriaAlerta: CategoriaAlerta, id: number): Observable<CategoriaAlerta> {
      const url = `${this._baseUrl}/CategoryAlert/${id}`;  // Incluye el id en la URL
      return this.http.put<CategoriaAlerta>(url, CategoriaAlerta);
    }

  }
