import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FarmUser } from './finca-usuario.module'; 
import { environment } from '../../../../env/enviroment'; 
@Injectable({
  providedIn: 'root'
})
export class FarmUserService {
  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getFarmUsers(): Observable<FarmUser[]> {
    return this.http.get<FarmUser[]>(`${this._baseUrl}/FarmUser/List`);
  }

  createFarmUsers(inventory: FarmUser): Observable<FarmUser> {
    return this.http.post<FarmUser>(`${this._baseUrl}/FarmUser/save`, inventory);
  }

  updateFarmUsers(inventory: FarmUser,  id: number): Observable<FarmUser> {
    return this.http.put<FarmUser>(`${this._baseUrl}/FarmUser/${id}`, inventory);
  }

  deleteFarmUsers(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/FarmUser/${id}`);
  }
  listUsersJoin():Observable<FarmUser[]>{
    return this.http.get<FarmUser[]>(`${this._baseUrl}/FarmUser/list-join-users`);
  }
  
  postCodeFarm(farmCode: string, userId: number): Observable<any> {
    // Crear los parámetros de consulta
    const params = new HttpParams()
      .set('farmCode', farmCode)
      .set('userId', userId.toString());

    return this.http.post<any>(`${this._baseUrl}/FarmUser/join-farm`, null, { params });
  }

  listUserFarmJoin(idUser:number):Observable<any>{
    return this.http.get<any>(`${this._baseUrl}/FarmUser/list-join-users/${idUser}`); 
  }
  joinUser(userFarmId: number): Observable<any> {
    return this.http.post<any>(`${this._baseUrl}/accept-user`, { userFarmId });
}
}