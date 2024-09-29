import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryMedicinas } from './categoria-medicina.module';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/enviroment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryMedicinasService {

  private _baseUrl = environment.apiBaseUrl;
  private roleSource = new BehaviorSubject<{id:number, name:string }>({id:0, name: ''});
  currentRole = this.roleSource.asObservable();
  constructor(private http:HttpClient) { }


  getCategoryMedicinas():Observable<CategoryMedicinas[]>{
    return this.http.get<CategoryMedicinas[]>(`${this._baseUrl}/CategoryMedicinas/list`);
  }

  onDeleteCategoryMedicinas(id:number):Observable<void>{
     return this.http.delete<void>(`${this._baseUrl}/CategoryMedicines/${id}`)
    }

    updateCategoryMedicinas(CategoryMedicinas: CategoryMedicinas, id: number):Observable<CategoryMedicinas>
    {

      return this.http.put<CategoryMedicinas>(`${this._baseUrl}/CategoryMedicines/${id}`, CategoryMedicinas)
    }

    createCategoryMedicinas(CategoryMedicinas: CategoryMedicinas):Observable<CategoryMedicinas>{
      return this.http.post<CategoryMedicinas>(`${this._baseUrl}/CategoryMedicines`, CategoryMedicinas);
    }
    changePerson(role:{id: number, name: string}){
      this.roleSource.next(role)
      localStorage.setItem('currentRole', JSON.stringify(role))
    }
  }
