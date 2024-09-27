import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Treatments } from './treatments.model';

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {
  private apiUrl = 'your-api-url/treatments';

  constructor(private http: HttpClient) {}

  getTreatments(): Observable<Treatments[]> {
    return this.http.get<Treatments[]>(this.apiUrl);
  }

  createTreatment(treatment: Treatments): Observable<Treatments> {
    return this.http.post<Treatments>(this.apiUrl, treatment);
  }

  updateTreatment(treatment: Treatments): Observable<Treatments> {
    return this.http.put<Treatments>(`${this.apiUrl}/${treatment.id}`, treatment);
  }

  deleteTreatment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
