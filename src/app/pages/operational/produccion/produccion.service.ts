import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Productions } from './produccion.module';
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductionsService {
  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getProductions(farmId:number): Observable<Productions[]> {
    return this.http.get<Productions[]>(`${this._baseUrl}/Production/datatable/${farmId}`);
  }

  createProduction(production: Productions): Observable<Productions> {
    return this.http.post<Productions>(`${this._baseUrl}/Production/save`, production);
  }

  updateProduction(production: Productions, id: number): Observable<Productions> {
    return this.http.put<Productions>(`${this._baseUrl}/Production/${id}`, production);
  }

  deleteProduction(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Production/${id}`);
  }
  getMonthlyMilkProduction(id:number): Observable<any[]> {
    return this.http.get<any[]>(`${this._baseUrl}/Production/monthly-milk-production/${id}`);
  }
}
