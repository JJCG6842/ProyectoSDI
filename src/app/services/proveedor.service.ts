import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../interface/proveedor.interface';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = "http://localhost:3000/proveedores";

  constructor(private http: HttpClient) {}

  getProveedores():Observable<Proveedor[]>{
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  getProveedorPorNombre(name: string):Observable<Proveedor>{
    return this.http.get<Proveedor>(`${this.apiUrl}/nombre/${name}`);
  }

  buscarProveedor(term: string): Observable<Proveedor[]>{
    return this.http.get<Proveedor[]>(`${this.apiUrl}/buscar/${term}`);
  }

  crearProveedor(data: Proveedor): Observable<Proveedor>{
    return this.http.post<Proveedor>(this.apiUrl, data);
  }

  actualizarProveedor(id: string, data:Proveedor): Observable<Proveedor>{
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, data);
  }

  eliminarProveedor(id: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
