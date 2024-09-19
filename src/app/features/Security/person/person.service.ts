import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from './person.module';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private _baseUrl = environment.apiBaseUrl;
  private roleSource = new BehaviorSubject<{id:number, name:string }>({id:0, name: ''});
  currentRole = this.roleSource.asObservable();
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
    changePerson(role:{id: number, name: string}){
      this.roleSource.next(role)
      localStorage.setItem('currentRole', JSON.stringify(role))
    }
  }
