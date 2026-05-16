import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Almacen } from '../interface/almacen.interface';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private apiUrl = 'http://localhost:3000/almacen';

  constructor(
    private http: HttpClient
  ) {}

  getAlmacenes(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(this.apiUrl);
  }

  getAlmacenPorId(id: string): Observable<Almacen> {
    return this.http.get<Almacen>(
      `${this.apiUrl}/${id}`
    );
  }

  crearAlmacen(
    almacen: Omit<
      Almacen,
      'id' | 'createdAt' | 'updatedAt' | 'products'
    >
  ): Observable<Almacen> {

    return this.http.post<Almacen>(
      this.apiUrl,
      almacen
    );
  }

  actualizarAlmacen(
    id: string,
    almacen: Partial<Almacen>
  ): Observable<Almacen> {

    return this.http.put<Almacen>(
      `${this.apiUrl}/${id}`,
      almacen
    );
  }

  eliminarAlmacen(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}

