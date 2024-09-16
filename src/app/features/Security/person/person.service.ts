import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from './person.module';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  
  getPerson():Observable<Person[]>{
    return this.http.get<Person[]>(`${this._baseUrl}/Person`);
  }

  onDeletePerson(id:number):Observable<void>{
     return this.http.delete<void>(`${this._baseUrl}/Person/${id}`)
    }

    updatePerson(person: Person, id: number):Observable<Person>
    {

      return this.http.put<Person>(`${this._baseUrl}/Person/${id}`, person)
    }

    createPerson(person: Person):Observable<Person>{
      return this.http.post<Person>(`${this._baseUrl}/Person`, person);
    }
}
