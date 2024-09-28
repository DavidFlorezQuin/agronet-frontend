import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventories } from './inventories.model';

@Injectable({
  providedIn: 'root'
})
export class InventoriesService {
  private apiUrl = 'your-api-url/inventories';

  constructor(private http: HttpClient) {}

  getInventories(): Observable<Inventories[]> {
    return this.http.get<Inventories[]>(this.apiUrl);
  }

  createInventory(inventory: Inventories): Observable<Inventories> {
    return this.http.post<Inventories>(this.apiUrl, inventory);
  }

  updateInventory(inventory: Inventories): Observable<Inventories> {
    return this.http.put<Inventories>(`${this.apiUrl}/${inventory.id}`, inventory);
  }

  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
