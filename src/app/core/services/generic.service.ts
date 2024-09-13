import { Injectable } from '@angular/core';
import { environment } from '../../../env/enviroment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  protected _baseUrl = environment.apiBaseUrl;
  constructor(protected http:HttpClient) { }

  get<T>(endpoint:string):Observable<T>{
    return this.http.get<T>(`${this._baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    )
  }
  post<T>(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this._baseUrl}/${endpoint}`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  
  
  

  private handleError(error: any){
    console.error(error);
    return throwError(()=>new Error(error.message || "Server Errorr"))
  }
}
