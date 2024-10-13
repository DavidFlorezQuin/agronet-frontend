
  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vaccines } from './vacuna.module'; 
import { environment } from '../../../../env/enviroment'; 

@Injectable({
  providedIn: 'root',
})
export class VaccinesService {
    
  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getVaccines(): Observable<Vaccines[]> {
    return this.http.get<Vaccines[]>(`${this._baseUrl}/Vaccine/List/`);
  }

  createVaccine(vaccine: Vaccines): Observable<Vaccines> {
    return this.http.post<Vaccines>(`${this._baseUrl}/Vaccine/save`, vaccine);
  }

  updateVaccine(vaccine: Vaccines, id: number): Observable<Vaccines> {
    return this.http.put<Vaccines>(`${this._baseUrl}/Vaccine/${id}`, vaccine);
  }

  deleteVaccine(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Vaccine/${id}`);
  }
}
