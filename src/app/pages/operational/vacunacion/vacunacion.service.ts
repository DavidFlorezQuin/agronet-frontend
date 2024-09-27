import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VaccineAnimals } from './vacunacion.module'; 

@Injectable({
  providedIn: 'root'
})
export class VaccineAnimalsService {
  private apiUrl = 'your-api-url/vaccine-animals';

  constructor(private http: HttpClient) {}

  getVaccineAnimals(): Observable<VaccineAnimals[]> {
    return this.http.get<VaccineAnimals[]>(this.apiUrl);
  }

  createVaccineAnimal(vaccineAnimal: VaccineAnimals): Observable<VaccineAnimals> {
    return this.http.post<VaccineAnimals>(this.apiUrl, vaccineAnimal);
  }

  updateVaccineAnimal(vaccineAnimal: VaccineAnimals): Observable<VaccineAnimals> {
    return this.http.put<VaccineAnimals>(`${this.apiUrl}/${vaccineAnimal.id}`, vaccineAnimal);
  }

  deleteVaccineAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
