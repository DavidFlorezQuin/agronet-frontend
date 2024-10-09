import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimalDiagnostics } from './AnimalDiagnostics.module';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment'; 

@Injectable({
  providedIn: 'root'
})
export class AnimalDiagnosticsService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAnimalDiagnostics(IdFarm:number): Observable<AnimalDiagnostics[]> {
    return this.http.get<AnimalDiagnostics[]>(`${this._baseUrl}/AnimalDiagnostic/datatable/${IdFarm}`);
  }

  deleteAnimalDiagnostics(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/AnimalDiagnostics/${id}`);
  }

  updateAnimalDiagnostics(animal: AnimalDiagnostics, id: number): Observable<AnimalDiagnostics> {
    return this.http.put<AnimalDiagnostics>(`${this._baseUrl}/AnimalDiagnostic/${id}`, animal);
  }

  createAnimalDiagnostics(animal: AnimalDiagnostics): Observable<AnimalDiagnostics> {
    return this.http.post<AnimalDiagnostics>(`${this._baseUrl}/AnimalDiagnostic/save`, animal);
  }
}
