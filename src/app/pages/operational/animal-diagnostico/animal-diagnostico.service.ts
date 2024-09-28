import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { animalDiagnostico } from './animal-diagnostico.module'; 
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AnimalDiagnosticoService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getAnimalDiagnostico(): Observable<animalDiagnostico[]> {
    return this.http.get<animalDiagnostico[]>(`${this._baseUrl}/AnimalDiagnostico/list`);  
  }
  createAnimalDiagnostico(modulo: animalDiagnostico): Observable<animalDiagnostico> {
    return this.http.post<animalDiagnostico>(`${this._baseUrl}/AnimalDiagnostico`, modulo);
  }

  deleteAnimalDiagnostico(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/AnimalDiagnostico/${id}`);
  }
  
  updateAnimalDiagnostico(modulo: animalDiagnostico, id: number): Observable<animalDiagnostico> {
    const url = `${this._baseUrl}/View/${id}`;  // Incluye el id en la URL
    return this.http.put<animalDiagnostico>(url, modulo);
  }
  
}

