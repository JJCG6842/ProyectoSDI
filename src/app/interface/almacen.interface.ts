import { Producto } from "./producto.interface";

export interface Almacen {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  products?: Producto[]; 
}