import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ventas } from './Ventas.module';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'your-api-url/Ventas';

  constructor(private http: HttpClient) {}

  getSales(): Observable<Ventas[]> {
    return this.http.get<Ventas[]>(this.apiUrl);
  }

  createSale(sale: Ventas): Observable<Ventas> {
    return this.http.post<Ventas>(this.apiUrl, sale);
  }

  updateSale(sale: Ventas): Observable<Ventas> {
    return this.http.put<Ventas>(`${this.apiUrl}/${sale.id}`, sale);
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
