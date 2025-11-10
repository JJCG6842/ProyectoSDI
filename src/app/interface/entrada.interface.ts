import { Producto } from "./producto.interface";
import { Proveedor } from "./proveedor.interface";

export interface Entrada {
  id: string;
  productId: string;
  quantity: number;
  supplierId?: string;
  createdAt: string;
  product: Producto;
  supplier?: Proveedor;
}