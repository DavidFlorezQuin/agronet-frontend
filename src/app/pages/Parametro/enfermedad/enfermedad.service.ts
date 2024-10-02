import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diseases } from './enfermedad.module'; 
import { environment } from '../../../../env/enviroment'; 

@Injectable({
  providedIn: 'root',
})
export class DiseasesService {
  private _baseUrl = `${environment.apiBaseUrl}/Diseases`;

  constructor(private http: HttpClient) {}

  getDiseases(): Observable<Diseases[]> {
    return this.http.get<Diseases[]>(`${this._baseUrl}/List`);
  }

  createDisease(disease: Diseases): Observable<Diseases> {
    return this.http.post<Diseases>(`${this._baseUrl}`, disease);
  }

  updateDisease(disease: Diseases, id: number): Observable<Diseases> {
    return this.http.put<Diseases>(`${this._baseUrl}/${id}`, disease);
  }

  deleteDisease(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
