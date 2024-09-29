import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRole } from './UserRole.module';
import { environment } from '../../../../env/enviroment';
import { User } from '../users/User.module';
import { Role } from '../role/role.module';
@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  private _baseUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  getUserRole(id:number):Observable<Role[]>{
    return this.http.get<Role[]>(`${this._baseUrl}/Role/UserRole/${id}`);
  }

  onDelete(id:number):Observable<void>{
    return this.http.delete<void>(`${this._baseUrl}/UserRole/${id}`);
  }

  updateUserRoles(user: User): Observable<User> {
    return this.http.put<User>(`${this._baseUrl}/${user.id}/roles`, user);
  }

  createUserRole(userRole: UserRole):Observable<UserRole>{
    return this.http.post<UserRole>(`${this._baseUrl}/UserRole`,userRole);
  }
}
