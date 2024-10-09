import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventories } from './Inventories.module';
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class InventoriesService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getInventories(IdFarm:number): Observable<Inventories[]> {
    return this.http.get<Inventories[]>(`${this._baseUrl}/Inventory/datatable/${IdFarm}`);
  }

  createInventory(inventory: Inventories): Observable<Inventories> {
    return this.http.post<Inventories>(`${this._baseUrl}/Inventory/save`, inventory);
  }

  updateInventory(inventory: Inventories,  id: number): Observable<Inventories> {
    return this.http.put<Inventories>(`${this._baseUrl}/Inventory/${id}`, inventory);
  }

  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Inventory/${id}`);
  }
}
