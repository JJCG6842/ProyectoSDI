import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salida } from '../interface/salida.interface';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  private apiUrl = 'http://localhost:3000/salida';

  constructor(private http: HttpClient) { }

  getSalidas(): Observable<Salida[]> {
    return this.http.get<Salida[]>(this.apiUrl);
  }

  getSalidaById(id: string): Observable<Salida> {
    return this.http.get<Salida>(`${this.apiUrl}/${id}`);
  }

  filtrarPorClienteProveedor(tipoSalida?:string,clienteId?: string, supplierId?: string,
    categoryId?: string, categoryName?: string
  ) {
  let query = '?';
  if (tipoSalida) query += `tiposalida=${tipoSalida}&`;
  if (clienteId) query += `clienteId=${clienteId}&`;
  if (supplierId) query += `supplierId=${supplierId}&`;
  if (categoryId) query += `categoryId=${categoryId}&`;
  if (categoryName) query += `categoryName=${categoryName}&`;

  return this.http.get<Salida[]>(`${this.apiUrl}/filtrar${query}`);
}

  buscarPorProducto(term: string): Observable<Salida[]> {
    return this.http.get<Salida[]>(`${this.apiUrl}/buscar/producto/${term}`);
  }

  createSalida(data: {
    tipo: string; supplierId?: string; clienteId?: string; productos: { productId: string; quantity: number; price: number }[];
  }): Observable<{ message: string; salidaId: string }> {
    return this.http.post<{ message: string; salidaId: string }>(this.apiUrl, data);
  }

  deleteSalida(id: string): Observable<{ message: string; eliminado?: any }> {
  return this.http.delete<{ message: string; eliminado?: any }>(`${this.apiUrl}/${id}`);
  }
}
