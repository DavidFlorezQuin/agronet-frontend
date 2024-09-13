import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRole } from './UserRole.module';
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  private _baseUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  getUserRole(id:number):Observable<UserRole[]>{
    return this.http.get<UserRole[]>(`${this._baseUrl}/Role/UserRole/${id}`);
  }

  onDelete(id:number):Observable<void>{
    return this.http.delete<void>(`${this._baseUrl}/UserRole/${id}`);
  }

  updateUserRole(userRole: UserRole, id:number):Observable<UserRole>{
    const url = `${this._baseUrl}/UserRole/${id}`;
    return this.http.put<UserRole>(url, userRole);
  }

  createUserRole(userRole: UserRole):Observable<UserRole>{
    return this.http.post<UserRole>(`${this._baseUrl}/UserRole`,userRole);
  }
}
