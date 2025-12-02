import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../interface/marca.interface';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private apiUrl = 'http://localhost:3000/marcas'; 

  constructor(private http: HttpClient) { }

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  getMarcaPorId(id: string): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`);
  }

  crearMarca(data: { name: string; description: string; categoryId: string }): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, data);
  }

  editarMarca(id: string, data: { name?: string; description?: string; categoryId?: string }): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/${id}`, data);
  }

  eliminarMarca(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarMarcaPorNombre(term: string): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/search?term=${term}`);
  }

  getMarcasPorCategoria(categoryId: string): Observable<Marca[]> {
  return this.http.get<Marca[]>(`${this.apiUrl}/filter?categoryId=${categoryId}`);
}
}
