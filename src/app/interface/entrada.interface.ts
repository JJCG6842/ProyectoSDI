import { Cliente } from "./cliente.interface";
import { Producto } from "./producto.interface";
import { Proveedor } from "./proveedor.interface";

export interface Entrada {
  id: string;
  tipoentrada: string;
  supplierId?: string;
  clienteId?: string;
  createdAt: string;
  detalles: EntradaDetalle[]
  supplier?: Proveedor;
  cliente?: Cliente;

  productos: {
    productId: string;
    productName?: string;
    productCategory?: string;
    quantity: number;
    price: number;
    total?: number;
  }[];
}

export interface EntradaDetalle {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  product: Producto;
}