import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment';
import { AnimalSale } from './animal-sale.module';
@Injectable({
  providedIn: 'root'
})
export class VentasAnimalService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  getSales(IdFarm:number): Observable<AnimalSale[]> {
    return this.http.get<AnimalSale[]>(`${this._baseUrl}/AnimalSales/datatable/${IdFarm}`);
  }

  createSale(sale: AnimalSale): Observable<AnimalSale> {
    return this.http.post<AnimalSale>(`${this._baseUrl}/AnimalSales/save`, sale);
  }

  updateSale(sale: AnimalSale, id:number): Observable<AnimalSale> {
    return this.http.put<AnimalSale>(`${this._baseUrl}/AnimalSales/${id}`, sale);
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/AnimalSales/${id}`);
  }
}
