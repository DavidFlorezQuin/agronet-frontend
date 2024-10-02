import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventarioHistoria } from './inventario-historia.module'; 
import { environment } from '../../../../env/enviroment';

@Injectable({
    providedIn: 'root'
  })
  export class InventarioHistoriaService {

    private _baseUrl = environment.apiBaseUrl;

    constructor(private http:HttpClient) { }

    getInventarioHistoria(): Observable<InventarioHistoria[]> {
      return this.http.get<InventarioHistoria[]>(`${this._baseUrl}/InventoryRecords/list`);
    }
    createInventarioHistoria(inventarioHistoria: InventarioHistoria): Observable<InventarioHistoria> {
      return this.http.post<InventarioHistoria>(`${this._baseUrl}/InventoryRecords`, inventarioHistoria);
    }

    deleteInventarioHistoria(id: number): Observable<void> {
      return this.http.delete<void>(`${this._baseUrl}/InventoryRecords/${id}`);
    }

    updateInventarioHistoria(inventarioHistoria: InventarioHistoria, id: number): Observable<InventarioHistoria> {
      const url = `${this._baseUrl}/InventoryRecords/${id}`;  // Incluye el id en la URL
      return this.http.put<InventarioHistoria>(url, inventarioHistoria);
    }

  }
