import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment';
import { Ventas } from './ventass.module';
@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getSales(IdFarm:number): Observable<Ventas[]> {
    return this.http.get<Ventas[]>(`${this._baseUrl}/Sale/datatable/${IdFarm}`);
  }

  createSale(sale: Ventas): Observable<Ventas> {
    return this.http.post<Ventas>(`${this._baseUrl}/Sale`, sale);
  }

  updateSale(sale: Ventas, id:number): Observable<Ventas> {
    return this.http.put<Ventas>(`${this._baseUrl}/Sale/${id}`, sale);
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Sale/${id}`);
  }
}
