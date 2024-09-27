import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HistoriaDeVidaComponent } from './historia-de-vida.component'; 
import { environment } from '../../../../env/enviroment'; 

@Injectable({
  providedIn: 'root',
})
export class HealthHistoryService {
  private http = inject(HttpClient);
  private apiUrl: string = environment.apiBaseUrl + 'healthHistory';

  constructor() {}

  lista() {
    return this.http.get<HistoriaDeVidaComponent[]>(this.apiUrl);
  }

  obtener(id: number) {
    return this.http.get<HistoriaDeVidaComponent>(`${this.apiUrl}/${id}`);
  }

  crear(historial: HistoriaDeVidaComponent) {
    return this.http.post<HistoriaDeVidaComponent>(this.apiUrl, historial);
  }

  editar(historial: HistoriaDeVidaComponent) {
    return this.http.put<HistoriaDeVidaComponent>(`${this.apiUrl}/${historial.id}`, historial);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
