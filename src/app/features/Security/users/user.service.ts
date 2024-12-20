import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "./User.module";
import { environment } from "../../../../env/enviroment";

@Injectable({
    providedIn:'root'
})

export class UserService{
    private _baseUrl = environment.apiBaseUrl;
    private userSource = new BehaviorSubject<{id:number, name:string}>({id:0,name:''});
    currentUser = this.userSource.asObservable();
    
    constructor(private http:HttpClient){
      const savedUser = localStorage.getItem('currentUser');
      if(savedUser){
        this.userSource.next(JSON.parse(savedUser))
      }
    }

    getUsers():Observable<any>{
        return this.http.get(`${this._baseUrl}/User`);
    }
    
  createRole(role: User): Observable<User> {
    return this.http.post<User>(`${this._baseUrl}/Role`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Role/${id}`);
  }
  
  updateRole(role: User, id: number): Observable<User> {
    const url = `${this._baseUrl}/Role/${id}`;  
    console.log(url)
    return this.http.put<User>(url, role);
  }
  changeUser(role:{id: number, name: string}){
    localStorage.setItem('currentUser', JSON.stringify(role))
  }
    
}