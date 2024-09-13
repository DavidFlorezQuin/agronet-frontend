import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../../features/login/models/Auth.module';
import { environment } from '../../../env/enviroment';
import { Observable } from 'rxjs';
import { RoleMenu } from '../../features/login/models/MenuRole.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: boolean = false; 

  private menuId:number = 0; 

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) {
   }

  login(auth: Auth): Observable<any> {
    return this.http.post<Auth>(`${this._baseUrl}/User/Login`, auth);
  }

  menu(id: number): Observable<RoleMenu[]> {
    return this.http.get<RoleMenu[]>(`${this._baseUrl}/User/menu/${id}`, {
    });
  }

  setLoggedIn(value: boolean) {
    this.loggedIn = value;
    localStorage.setItem('loggedIn', value.toString());
  }

  isLoggedIn(): boolean {
      return this.loggedIn || localStorage.getItem('loggedIn') === 'true';
    }

    setRoleMenu(menu:number):void{
        this.menuId = menu 
    }

    getRoleMenu():number | 0{
      return this.menuId; 
    }
  
}
