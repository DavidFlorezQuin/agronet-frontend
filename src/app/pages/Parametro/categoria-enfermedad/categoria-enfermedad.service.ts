import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDisieses } from './categoria-enfermedad.module'; 
import { environment } from '../../../../env/enviroment'; 

@Injectable({
  providedIn: 'root',
})
export class CategoryDisiesesService {
  private _baseUrl = `${environment.apiBaseUrl}/CategoryDisease`;

  constructor(private http: HttpClient) {}

  getCategoryDisieses(): Observable<CategoryDisieses[]> {
    return this.http.get<CategoryDisieses[]>(`${this._baseUrl}/List`);
  }

  createCategoryDisieses(category: CategoryDisieses): Observable<CategoryDisieses> {
    return this.http.post<CategoryDisieses>(`${this._baseUrl}`, category);
  }

  updateCategoryDisieses(category: CategoryDisieses, id: number): Observable<CategoryDisieses> {
    return this.http.put<CategoryDisieses>(`${this._baseUrl}/${id}`, category);
  }

  deleteCategoryDisieses(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
