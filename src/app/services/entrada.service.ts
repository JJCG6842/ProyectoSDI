import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrada } from '../interface/entrada.interface';

@Injectable({
  providedIn: 'root',
})
export class EntradaService {
  private readonly apiUrl = 'http://localhost:3000/entrada'; 

  constructor(private http: HttpClient) {}

  getEntradas(): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl);
  }

  getEntradaPorId(id: string): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiUrl}/${id}`);
  }

  buscarPorProducto(term: string): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(`${this.apiUrl}/buscar/producto/${term}`);
  }

  crearEntrada(data: {
    productId: string;
    quantity: number;
    supplierId?: string;
  }): Observable<Entrada> {
    return this.http.post<Entrada>(this.apiUrl, data);
  }

  eliminarEntrada(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
