import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Productions } from './produccion.module'; 
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductionsService {
  private _baseUrl = environment.apiBaseUrl;;
  private roleSource = new BehaviorSubject<{id:number, name:string }>({id:0, name: ''});
  currentRole = this.roleSource.asObservable();
  constructor(private http: HttpClient) {}

  getProductions(): Observable<Productions[]> {
    return this.http.get<Productions[]>(`${this._baseUrl}/Productions/list`);
  }

  createProduction(production: Productions): Observable<Productions> {
    return this.http.post<Productions>(`${this._baseUrl}/Productions`, production);
  }

  updateProduction(production: Productions, id:number): Observable<Productions> {
    return this.http.put<Productions>(`${this._baseUrl}/Productions/${id}`, production);
  }

  deleteProduction(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Productions/${id}`);
  }
  changeProduction(role:{id: number, name: string}){
    this.roleSource.next(role)
    localStorage.setItem('currentRole', JSON.stringify(role))
  }
}
