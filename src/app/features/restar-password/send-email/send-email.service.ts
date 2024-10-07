import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../env/enviroment';
import { Observable } from 'rxjs';
import { Email } from './Email.module';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  resetPassword(email: Email): Observable<any> {
    return this.http.post<Email>(`${this._baseUrl}/Email/forgot-password`, email);
  }}
