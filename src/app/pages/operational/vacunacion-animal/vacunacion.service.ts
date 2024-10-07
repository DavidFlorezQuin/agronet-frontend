import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VaccineAnimals } from './vacunacion.module'; 
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class VaccineAnimalsService {
  private _baseUrl = environment.apiBaseUrl;;

  constructor(private http: HttpClient) {}

  getVaccineAnimals(IdFarm:number): Observable<VaccineAnimals[]> {
    return this.http.get<VaccineAnimals[]>(`${this._baseUrl}/VaccineAnimal/datatable/${IdFarm}`);
  }

  createVaccineAnimal(vaccineAnimal: VaccineAnimals): Observable<VaccineAnimals> {
    return this.http.post<VaccineAnimals>(`${this._baseUrl}/VaccineAnimal`, vaccineAnimal);
  }

  updateVaccineAnimal(vaccineAnimal: VaccineAnimals, id: number): Observable<VaccineAnimals> {
    return this.http.put<VaccineAnimals>(`${this._baseUrl}/VaccineAnimal/${id}`, vaccineAnimal);
  }

  deleteVaccineAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/VaccineAnimal/${id}`);
  }
}
