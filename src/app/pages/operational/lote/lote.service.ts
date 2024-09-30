import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lote } from './lote.module';  
import { environment } from '../../../../env/enviroment'; 

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getLote(): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${this._baseUrl}/Lot/List`);
  }

  deleteLote(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Lote/${id}`);
  }

  updateLote(lote: Lote, id: number): Observable<Lote> {
    return this.http.put<Lote>(`${this._baseUrl}/Lote/${id}`, lote);
  }

  createLote(lote: Lote): Observable<Lote> {
    return this.http.post<Lote>(`${this._baseUrl}/Lote`, lote);
  }
}
