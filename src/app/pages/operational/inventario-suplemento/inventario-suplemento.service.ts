import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventarioSuplemento } from './inventario-suplemento.module'; 
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class InventarioSuplementoService {
  private _baseUrl = environment.apiBaseUrl;;
  private roleSource = new BehaviorSubject<{id:number, name:string }>({id:0, name: ''});
  currentRole = this.roleSource.asObservable();
  constructor(private http: HttpClient) {}

  getInventarioSuplemento(): Observable<InventarioSuplemento[]> {
    return this.http.get<InventarioSuplemento[]>(`${this._baseUrl}/InventorySupplies/list`);
  }

  createInventarioSuplemento(inventarioSuplemento: InventarioSuplemento): Observable<InventarioSuplemento> {
    return this.http.post<InventarioSuplemento>(`${this._baseUrl}/InventorySupplies`, inventarioSuplemento);
  }

  updateInventarioSuplemento(inventarioSuplemento: InventarioSuplemento, id:number): Observable<InventarioSuplemento> {
    return this.http.put<InventarioSuplemento>(`${this._baseUrl}/InventorySupplies/${id}`, inventarioSuplemento);
  }

  deleteInventarioSuplemento(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/InventorySupplies/${id}`);
  }
  changeProduction(role:{id: number, name: string}){
    this.roleSource.next(role)
    localStorage.setItem('currentRole', JSON.stringify(role))
  }
}
