import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interface/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:3000/cliente';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getClientePorNombre(name: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/nombre/${name}`);
  }

  buscarCliente(term: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscar/${term}`);
  }

  getClientePorId(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  crearCliente(data: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, data);
  }

  actualizarCliente(id: string, data: Partial<Cliente>) {
  return this.http.put(`${this.apiUrl}/${id}`, data);
}

  eliminarCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
