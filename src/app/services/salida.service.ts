import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salida } from '../interface/salida.interface';

export interface ProductoSalida {
  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  private apiUrl = 'https://proyectosdibackend.onrender.com/salida';

  constructor(private http: HttpClient) { }

  getSalidas(): Observable<Salida[]> {
    return this.http.get<Salida[]>(this.apiUrl);
  }

  getSalidaById(id: string): Observable<Salida> {
    return this.http.get<Salida>(`${this.apiUrl}/${id}`);
  }

  getSalidasByUser(userId: string): Observable<Salida[]> {
    return this.http.get<Salida[]>(`${this.apiUrl}/usuario/${userId}`);
  }

  buscarPorNombreUsuario(nombre: string): Observable<Salida[]> {
    return this.http.get<Salida[]>(`${this.apiUrl}/buscar/usuario/${nombre}`);
  }

  buscarPorProducto(term: string): Observable<Salida[]> {
    return this.http.get<Salida[]>(`${this.apiUrl}/buscar/producto/${term}`);
  }

  buscarPorAsignado(nombre: string): Observable<Salida[]> {
    return this.http.get<Salida[]>(`${this.apiUrl}/buscar/asignado/${nombre}`);
  }

  createSalida(data: { userId: string; asignadoA: string ;productos: ProductoSalida[] }): Observable<Salida>{
    return this.http.post<Salida>(this.apiUrl, data);
  }

  deleteSalida(id: string): Observable<{ message: string; eliminado?: any }> {
    return this.http.delete<{ message: string; eliminado?: any }>(`${this.apiUrl}/${id}`);
  }
}