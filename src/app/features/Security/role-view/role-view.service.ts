import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { View } from '../views/view.module';
import { RoleView } from './ViewRole.module';
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RoleViewService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getViewRole(id:number):Observable<View[]>{
    return this.http.get<View[]>(`${this._baseUrl}/byRole/${id}`);
  }

  onDelete(id:number):Observable<void>{
     return this.http.delete<void>(`${this._baseUrl}/RoleView/${id}`)
    }

    updateRoleView(roleView: RoleView, id: number):Observable<RoleView>
    {
      const url = `${this._baseUrl}/RoleView/${id}`;
      return this.http.put<RoleView>(url, roleView)
    }

    createRoleView(roleView: RoleView):Observable<RoleView>{
      return this.http.post<RoleView>(`${this._baseUrl}/RoleView`, roleView);
    }

}
