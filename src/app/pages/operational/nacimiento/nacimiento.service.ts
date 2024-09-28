import { Inject, Injectable } from "@angular/core";
import { environment } from "../../../../env/enviroment";
import { HttpClient } from "@angular/common/http";
import { Nacimiento } from "./nacimiento.module";
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class NacimetoService{

    private _baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient){}

    getNacimiento(): Observable<Nacimiento[]> {
        return this.http.get<Nacimiento[]>(`${this._baseUrl}/Nacimiento`);
      }
    
      deleteNacimiento(id: number): Observable<void> {
        return this.http.delete<void>(`${this._baseUrl}/Nacimiento/${id}`);
      }
    
      updateNacimiento(nacimiento: Nacimiento, id: number): Observable<Nacimiento> {
        return this.http.put<Nacimiento>(`${this._baseUrl}/Nacimiento/${id}`, nacimiento);
      }
    
      createNacimiento(nacimiento: Nacimiento): Observable<Nacimiento> {
        return this.http.post<Nacimiento>(`${this._baseUrl}/Nacimiento`, nacimiento);
      }
}