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

  getAllTreatmentsMedicinesService (IdFarm:number): Observable<TreatmentsMedicines[]> {
    return this.http.get<TreatmentsMedicines[]>(`${this._baseUrl}/datatable/${IdFarm}`);
  }

  createTreatmentsMedicinesService (treatmentMedicine: TreatmentsMedicines): Observable<TreatmentsMedicines> {
    return this.http.post<TreatmentsMedicines>(`${this._baseUrl}/save`, treatmentMedicine);
  }

  updateTreatmentsMedicinesService (id: number, treatmentMedicine: TreatmentsMedicines): Observable<TreatmentsMedicines> {
    return this.http.put<TreatmentsMedicines>(`${this._baseUrl}/${id}`, treatmentMedicine);
  }

  deleteTreatmentsMedicinesService (id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
