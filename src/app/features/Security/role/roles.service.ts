import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from './role.module';
import { environment } from '../../../../env/enviroment';


@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private _baseUrl = environment.apiBaseUrl;
  private roleSource = new BehaviorSubject<{id:number, name:string}>({id:0, name: ''});
  currentRole = this.roleSource.asObservable();

  constructor(private http: HttpClient) {
    const savedRole = localStorage.getItem('currentRole');
    if (savedRole) {
      this.roleSource.next(JSON.parse(savedRole));
    }
   }

  getRoles(): Observable<any> {
    return this.http.get(`${this._baseUrl}/Role/list`);
  }
  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this._baseUrl}/Role`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Role/${id}`);
  }

  updateRole(role: Role, id: number): Observable<Role> {
    const url = `${this._baseUrl}/Role/${id}`;  // Incluye el id en la URL
    console.log(url)
    return this.http.put<Role>(url, role);
  }

  changeRole(role:{id: number, name: string}){
    this.roleSource.next(role)
    localStorage.setItem('currentRole', JSON.stringify(role))
  }

}
