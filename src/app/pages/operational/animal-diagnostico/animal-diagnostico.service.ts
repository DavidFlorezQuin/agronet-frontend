import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimalDiagnostics } from './animal-diagnostico.module';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment'; 

@Injectable({
  providedIn: 'root'
})
export class AnimalDiagnosticsService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAnimalDiagnostics(): Observable<AnimalDiagnostics[]> {
    return this.http.get<AnimalDiagnostics[]>(`${this._baseUrl}/AnimalDiagnostics/List`);
  }

  deleteAnimalDiagnostics(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/AnimalDiagnostics/${id}`);
  }

  updateAnimalDiagnostics(finca: AnimalDiagnostics, id: number): Observable<AnimalDiagnostics> {
    return this.http.put<AnimalDiagnostics>(`${this._baseUrl}/AnimalDiagnostics/${id}`, finca);
  }

  createAnimalDiagnostics(finca: AnimalDiagnostics): Observable<AnimalDiagnostics> {
    return this.http.post<AnimalDiagnostics>(`${this._baseUrl}/AnimalDiagnostics`, finca);
  }
}
