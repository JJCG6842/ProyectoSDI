import { Producto } from "./producto.interface";

export interface Almacen {
  id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;

  createdAt: Date;
  updatedAt: Date;

  products?: Producto[];
}

