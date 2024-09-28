import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from './animal.module'; 
import { environment } from '../../../../env/enviroment'; 

//thus coment

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private _baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this._baseUrl}/Animal`);
  }

  deleteAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Animal/${id}`);
  }

  updateAnimal(animal: Animal, id: number): Observable<Animal> {
    return this.http.put<Animal>(`${this._baseUrl}/Animal/${id}`, animal);
  }

  createAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(`${this._baseUrl}/Animal`, animal);
  }
}
