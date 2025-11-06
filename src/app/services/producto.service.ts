import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interface/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

   private apiUrl = "http://localhost:3000/productos";

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProductoporId(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar/nombre/${nombre}`);
  }

  buscarProducto(term: string): Observable<Producto[]>{
      return this.http.get<Producto[]>(`${this.apiUrl}/buscar/nombre/${term}`)
  }

  buscarPorCategoria(nombreCategoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar/categoria/${nombreCategoria}`);
  }

  buscarPorMarca(marca: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar/marca/${marca}`);
  }

  crearProducto(producto: Omit<Producto, 'id' | 'createAt' | 'updateAt'>): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizarProducto(id: string, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarPorCategoriaId(id: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar/categoria/id/${id}`);
  }

  buscarPorMarcaId(id: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar/marca/id/${id}`);
  }

}
