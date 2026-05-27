import { Producto } from "./producto.interface";
import { Proveedor } from "./proveedor.interface";

export interface GuiaRemision {
  id: string;
  numero: string;
  supplierId: string;
  fechaEmision: string;
  estado: 'PENDIENTE' | 'RECIBIDO' | 'CANCELADO';
  supplier?: Proveedor;
  detalles: GuiaRemisionDetalle[];
  createdAt: string;
  updatedAt: string;
}

export interface GuiaRemisionDetalle {
  id: string;
  guiaId: string;
  productId: string;
  cantidad: number;
  product: Producto;
  serialNumbers?: GuiaSerial[];
}

export interface GuiaSerial {
  id: string;
  serial: string;
}