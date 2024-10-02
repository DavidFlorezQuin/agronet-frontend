import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TreatmentsMedicines } from './tratamiento-medecinas.module'; 
import { environment } from '../../../../env/enviroment'; 

@Injectable({
  providedIn: 'root',
})
export class TreatmentsMedicinesService {
  private _baseUrl = `${environment.apiBaseUrl}/TreatmentMedicines`;

  constructor(private http: HttpClient) {}

  getAllTreatmentsMedicinesService (): Observable<TreatmentsMedicines[]> {
    return this.http.get<TreatmentsMedicines[]>(`${this._baseUrl}/List`);
  }

  createTreatmentsMedicinesService (treatmentMedicine: TreatmentsMedicines): Observable<TreatmentsMedicines> {
    return this.http.post<TreatmentsMedicines>(`${this._baseUrl}`, treatmentMedicine);
  }

  updateTreatmentsMedicinesService (id: number, treatmentMedicine: TreatmentsMedicines): Observable<TreatmentsMedicines> {
    return this.http.put<TreatmentsMedicines>(`${this._baseUrl}/${id}`, treatmentMedicine);
  }

  deleteTreatmentsMedicinesService (id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
