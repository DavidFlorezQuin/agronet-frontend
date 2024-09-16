import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insemination } from './insemination.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InseminationService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getInseminations(): Observable<Insemination[]> {
    return this.http.get<Insemination[]>(`${this._baseUrl}/Insemination`);
  }

  deleteInsemination(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Insemination/${id}`);
  }

  updateInsemination(insemination: Insemination, id: number): Observable<Insemination> {
    return this.http.put<Insemination>(`${this._baseUrl}/Insemination/${id}`, insemination);
  }

  createInsemination(insemination: Insemination): Observable<Insemination> {
    return this.http.post<Insemination>(`${this._baseUrl}/Insemination`, insemination);
  }
}
