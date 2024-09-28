import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplies } from './supplies.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuppliesService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getSupplies(): Observable<Supplies[]> {
    return this.http.get<Supplies[]>(`${this._baseUrl}/Supplies`);
  }

  deleteSupply(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Supplies/${id}`);
  }

  updateSupply(supply: Supplies, id: number): Observable<Supplies> {
    return this.http.put<Supplies>(`${this._baseUrl}/Supplies/${id}`, supply);
  }

  createSupply(supply: Supplies): Observable<Supplies> {
    return this.http.post<Supplies>(`${this._baseUrl}/Supplies`, supply);
  }
}
