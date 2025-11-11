import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salida } from '../interface/salida.interface';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  private apiUrl = 'http://localhost:3000/salida';

  constructor(private http: HttpClient) {}

  getSalidas(): Observable<Salida[]> {
    return this.http.get<Salida[]>(this.apiUrl);
  }

  getSalidaById(id: string): Observable<Salida> {
    return this.http.get<Salida>(`${this.apiUrl}/${id}`);
  }

  buscarPorProducto(term: string): Observable<Salida[]> {
    return this.http.get<Salida[]>(`${this.apiUrl}/buscar/producto/${term}`);
  }

  createSalida(data: { productId: string; quantity: number; supplierId?: string }): Observable<Salida> {
    return this.http.post<Salida>(this.apiUrl, data);
  }

  deleteSalida(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
