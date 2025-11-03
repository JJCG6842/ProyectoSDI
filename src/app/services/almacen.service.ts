import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Almacen } from '../interface/almacen.interface';
import { Producto } from '../interface/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class AlmacenesService {
  private apiUrl = 'http://localhost:3000/almacenes'; 

  constructor(private http: HttpClient) {}

 
  crearAlmacen(data: Almacen): Observable<Almacen> {
    return this.http.post<Almacen>(this.apiUrl, data);
  }


  obtenerAlmacenes(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(this.apiUrl);
  }

  obtenerProductosPorAlmacen(id: string): Observable<Almacen> {
    return this.http.get<Almacen>(`${this.apiUrl}/${id}/productos`);
  }

  agregarProductoAAlmacen(storeId: string, producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/${storeId}/productos`, producto);
  }


  buscarProducto(nombre: string, storeId?: string): Observable<Producto[]> {
    const params = storeId ? `?nombre=${nombre}&storeId=${storeId}` : `?nombre=${nombre}`;
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar${params}`);
  }

  editarAlmacen(id: string, data: Partial<Almacen>): Observable<Almacen> {
    return this.http.put<Almacen>(`${this.apiUrl}/${id}`, data);
  }

  eliminarAlmacen(id: string): Observable<Almacen> {
    return this.http.delete<Almacen>(`${this.apiUrl}/${id}`);
  }

  eliminarProducto(id: string): Observable<Producto> {
    return this.http.delete<Producto>(`${this.apiUrl}/productos/${id}`);
  }

  
}
