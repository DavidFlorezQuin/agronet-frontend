import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FarmUser } from './finca-usuario.module'; 
import { environment } from '../../../../env/enviroment'; 
@Injectable({
  providedIn: 'root'
})
export class FarmUserService {
  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getFarmUsers(): Observable<FarmUser[]> {
    return this.http.get<FarmUser[]>(`${this._baseUrl}/FarmUser/List`);
  }

  createFarmUsers(inventory: FarmUser): Observable<FarmUser> {
    return this.http.post<FarmUser>(`${this._baseUrl}/FarmUser/save`, inventory);
  }

  updateFarmUsers(inventory: FarmUser,  id: number): Observable<FarmUser> {
    return this.http.put<FarmUser>(`${this._baseUrl}/FarmUser/${id}`, inventory);
  }

  deleteFarmUsers(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/FarmUser/${id}`);
  }
}