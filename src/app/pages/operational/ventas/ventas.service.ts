import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sales } from './sales.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'your-api-url/sales';

  constructor(private http: HttpClient) {}

  getSales(): Observable<Sales[]> {
    return this.http.get<Sales[]>(this.apiUrl);
  }

  createSale(sale: Sales): Observable<Sales> {
    return this.http.post<Sales>(this.apiUrl, sale);
  }

  updateSale(sale: Sales): Observable<Sales> {
    return this.http.put<Sales>(`${this.apiUrl}/${sale.id}`, sale);
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
