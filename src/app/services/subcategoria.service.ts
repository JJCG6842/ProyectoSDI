import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subcategoria } from '../interface/subcategoria.interface';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  private apiUrl = "http://localhost:3000/subcategoria";

  constructor(private http: HttpClient){}

  getSubcategorias(): Observable<Subcategoria[]>{
    return this.http.get<Subcategoria[]>(this.apiUrl);
  }

  getSubcategoriaByName(name: string): Observable<Subcategoria>{
    return this.http.get<Subcategoria>(`${this.apiUrl}/nombre/${name}`);
  }

  buscarSubcategoria(term: string): Observable<Subcategoria[]>{
    return this.http.get<Subcategoria[]>(`${this.apiUrl}/buscar/${term}`);
  }

  getSubcategoriasByCategoryId(categoryId: string): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.apiUrl}/categoria/${categoryId}`);
  }

  getSubcategoriasByCategoryName(categoryName: string): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.apiUrl}/categoria/nombre/${categoryName}`);
  }

  crearSubcategoria(subcategoria: { name: string; description: string; categoryId: string }): Observable<Subcategoria>{
    return this.http.post<Subcategoria>(this.apiUrl, subcategoria);
  }

  actualizarSubcategoria(id: string, data: {name?: string; description?: string; categoryId?: string}): Observable<Subcategoria> {
    return this.http.put<Subcategoria>(`${this.apiUrl}/${id}`, data);
  }

  eliminarSubcategoria(id: string): Observable<Subcategoria>{
    return this.http.delete<Subcategoria>(`${this.apiUrl}/${id}`);
  }
}