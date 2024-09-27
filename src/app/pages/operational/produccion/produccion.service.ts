import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Productions } from './produccion.module'; 

@Injectable({
  providedIn: 'root'
})
export class ProductionsService {
  private apiUrl = 'your-api-url/productions';
  private roleSource = new BehaviorSubject<{id:number, name:string }>({id:0, name: ''});
  currentRole = this.roleSource.asObservable();
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
  changeProduction(role:{id: number, name: string}){
    this.roleSource.next(role)
    localStorage.setItem('currentRole', JSON.stringify(role))
  }
}
