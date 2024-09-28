import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Finca } from './finca.module';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment'; 

@Injectable({
  providedIn: 'root'
})
export class FincaService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getFincas(): Observable<Finca[]> {
    return this.http.get<Finca[]>(`${this._baseUrl}/Finca`);
  }

  deleteFinca(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Finca/${id}`);
  }

  updateFinca(finca: Finca, id: number): Observable<Finca> {
    return this.http.put<Finca>(`${this._baseUrl}/Finca/${id}`, finca);
  }

  createFinca(finca: Finca): Observable<Finca> {
    return this.http.post<Finca>(`${this._baseUrl}/Finca`, finca);
  }
}
