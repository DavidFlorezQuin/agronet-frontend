import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Productions } from './produccion.module'; 

@Injectable({
  providedIn: 'root'
})
export class ProductionsService {
  private apiUrl = 'your-api-url/productions';

  constructor(private http: HttpClient) {}

  getProductions(): Observable<Productions[]> {
    return this.http.get<Productions[]>(this.apiUrl);
  }

  createProduction(production: Productions): Observable<Productions> {
    return this.http.post<Productions>(this.apiUrl, production);
  }

  updateProduction(production: Productions): Observable<Productions> {
    return this.http.put<Productions>(`${this.apiUrl}/${production.id}`, production);
  }

  deleteProduction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
