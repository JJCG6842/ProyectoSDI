import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../interface/categoria.interface';

@Injectable({
  providedIn: 'root',
})

export class CategoriaService{
    private apiUrl = "http://localhost:3000/categoria";

    constructor(private http: HttpClient) {}

    getCategorias():Observable<Categoria[]>{
        return this.http.get<Categoria[]>(this.apiUrl);
    }

    crearCategoria(data: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, data);
    }

    actualizarCategoria(id:string, data: Categoria): Observable<Categoria> {
      return this.http.put<Categoria>(`${this.apiUrl}/${id}`, data);
    }

    eliminarCategoriaporId(id: string): Observable<void>{
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
}