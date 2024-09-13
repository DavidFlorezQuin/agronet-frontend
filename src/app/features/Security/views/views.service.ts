import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { View } from './view.module';
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getViews(): Observable<View[]> {
    return this.http.get<View[]>(`${this._baseUrl}/View`);  
  }
  createViews(modulo: View): Observable<View> {
    return this.http.post<View>(`${this._baseUrl}/View`, modulo);
  }

  deleteViews(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/View/${id}`);
  }
  
  updateViews(modulo: View, id: number): Observable<View> {
    const url = `${this._baseUrl}/View/${id}`;  // Incluye el id en la URL
    return this.http.put<View>(url, modulo);
  }
  
}

