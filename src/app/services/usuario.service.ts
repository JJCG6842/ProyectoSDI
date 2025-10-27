import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interface/usuario.interface';
import { Categoria } from '../interface/categoria.interface';


@Injectable({
  providedIn: 'root',
})

export class UsuarioService{
    private apiUrl = "http://localhost:3000/usuario";

    constructor(private http: HttpClient) {}

    getUsuario():Observable<Usuario[]>{
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    getUsuarioPorNombre(nombre: string): Observable<Usuario>{
        return this.http.get<Usuario>(`${this.apiUrl}/nombre/${nombre}`);
    }

    buscarUsuario(term: string): Observable<Usuario[]>{
        return this.http.get<Usuario[]>(`${this.apiUrl}/buscar/${term}`);
    }

    crearUsuario(data: Usuario): Observable<Usuario>{
        return this.http.post<Usuario>(this.apiUrl, data);
    }

    actualizarUsuario(id:string, data: Usuario): Observable<Usuario>{
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, data);
    }

    eliminarUsuario(id: string): Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    login(nombre: string, password: string) {
  return this.http.post<{ message: string; user: any }>(
    `${this.apiUrl}/login`,
    { nombre, password }
  );
}
}
