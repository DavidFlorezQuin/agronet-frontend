import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../env/enviroment';
import { Observable } from 'rxjs';
import { NewSend } from './NewSend.module';

@Injectable({
  providedIn: 'root'
})
export class NewSendService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  resetPassword(send: NewSend): Observable<any> {
    return this.http.post<NewSend>(`${this._baseUrl}/Email/reset-password`, send);
  }}
