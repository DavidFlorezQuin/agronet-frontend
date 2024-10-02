import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaSuplemento } from './categoria-suplemento.module'; 
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class  CategoriaSuplementoService {

  private _baseUrl = environment.apiBaseUrl;
  
  private roleSource = new BehaviorSubject<{id:number, name:string }>({id:0, name: ''});
  currentRole = this.roleSource.asObservable();
  constructor(private http:HttpClient) { }


  getCategoryMedicinas():Observable<CategoriaSuplemento[]>{
    return this.http.get<CategoriaSuplemento[]>(`${this._baseUrl}/CategorySupplies/list`);
  }

  onDeleteCategoryMedicinas(id:number):Observable<void>{
     return this.http.delete<void>(`${this._baseUrl}/CategorySupplies/${id}`)
    }

    updateCategoryMedicinas(CategoryMedicinas: CategoriaSuplemento, id: number):Observable<CategoriaSuplemento>
    {

      return this.http.put<CategoriaSuplemento>(`${this._baseUrl}/CategorySupplies/${id}`, CategoryMedicinas)
    }

    createCategoryMedicinas(CategoryMedicinas: CategoriaSuplemento):Observable<CategoriaSuplemento>{
      return this.http.post<CategoriaSuplemento>(`${this._baseUrl}/CategorySupplies`, CategoryMedicinas);
    }
    changePerson(role:{id: number, name: string}){
      this.roleSource.next(role)
      localStorage.setItem('currentRole', JSON.stringify(role))
    }
  }
