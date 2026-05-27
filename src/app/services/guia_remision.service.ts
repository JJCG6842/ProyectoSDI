import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GuiaRemision } from '../interface/guia_remision';

@Injectable({
  providedIn: 'root'
})

export class GuiaRemisionService {

  private apiUrl = 'http://localhost:3000/guia-remision';

  constructor(private http: HttpClient) {}

  getGuias(): Observable<GuiaRemision[]> {
    return this.http.get<GuiaRemision[]>(this.apiUrl);
  }

  getGuiaById(id: string): Observable<GuiaRemision> {
    return this.http.get<GuiaRemision>(`${this.apiUrl}/${id}`);
  }

  crearGuia(data: {
    numero: string;
    supplierId: string;
    productos: {
      productId: string;
      quantity: number;
      serialNumbers?: string[];
    }[];
  }): Observable<GuiaRemision> {

    return this.http.post<GuiaRemision>(
      this.apiUrl,
      data
    );
  }

  actualizarGuia(
  id: string,
  data: {
    estado: string | null;
  }
): Observable<GuiaRemision> {

  return this.http.patch<GuiaRemision>(
    `${this.apiUrl}/${id}`,
    data
  );

}


  confirmarGuia(id: string) {
    return this.http.post(`${this.apiUrl}/${id}/confirmar`,{});
  }

  eliminarGuia(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}