import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EnumService {
    private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getRace():Observable<any>{
    return this.http.get<any>(`${this._baseUrl}/Enum/Race`);
  }
  getTypeDocument():Observable<any>{
    return this.http.get<any>(`${this._baseUrl}/Enum/TypeDocument`); 
  }
  getMeasurement():Observable<any>{
    return this.http.get<any>(`${this._baseUrl}/Enum/Measurement`)
  }

}
