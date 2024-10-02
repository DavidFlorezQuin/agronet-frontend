import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medicina } from './medicina.component.module';
import { environment } from '../../../../env/enviroment';

@Injectable({
    providedIn: 'root'
  })
  export class MedicinaService {

    private _baseUrl = environment.apiBaseUrl;

    constructor(private http:HttpClient) { }

    getMedicina(): Observable<Medicina[]> {
      return this.http.get<Medicina[]>(`${this._baseUrl}/Medicines/list`);
    }
    createMedicina(medicina: Medicina): Observable<Medicina> {
      return this.http.post<Medicina>(`${this._baseUrl}/Medicines`, medicina);
    }

    deleteMedicina(id: number): Observable<void> {
      return this.http.delete<void>(`${this._baseUrl}/Medicines/${id}`);
    }

    updateMedicina(medicina: Medicina, id: number): Observable<Medicina> {
      const url = `${this._baseUrl}/Medicines/${id}`;  // Incluye el id en la URL
      return this.http.put<Medicina>(url, medicina);
    }

  }
