import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Treatments } from './tratamiento.module'; 
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {
  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getTreatments(): Observable<Treatments[]> {
    return this.http.get<Treatments[]>(`${this._baseUrl}/Treatment/List`);
  }

  createTreatment(treatment: Treatments): Observable<Treatments> {
    return this.http.post<Treatments>(`${this._baseUrl}/Treatment`,treatment)
  }

  updateTreatment(treatment: Treatments, id:number): Observable<Treatments> {
    const url = `${this._baseUrl}/Treatment/${id}`
    return this.http.put<Treatments>(url,treatment);  }

  deleteTreatment(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Treatment${id}`)
  }
}
