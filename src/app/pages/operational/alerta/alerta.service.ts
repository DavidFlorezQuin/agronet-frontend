import { Alerta } from './alerta.module';
import { Injectable } from '@angular/core';
import { environment } from '../../../../env/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getAlerta():Observable<Alerta[]>{
    return this.http.get<Alerta[]>(`${this._baseUrl}/AlertController`);
  }

  createAlerta(Alerta:Alerta):Observable<Alerta>{
    return this.http.post<Alerta>(`${this._baseUrl}/AlertController`,Alerta)
  }

  deleteAlerta(id:number):Observable<void>{
    return this.http.delete<void>(`${this._baseUrl}/AlertController${id}`)
  }

  updateAlerta(Alerta:Alerta, id:number):Observable<Alerta>{
    const url = `${this._baseUrl}/AlertController/${id}`
    return this.http.put<Alerta>(url,Alerta);
  }
}
