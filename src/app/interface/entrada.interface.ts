import { Producto } from "./producto.interface";
import { Proveedor } from "./proveedor.interface";

export interface Entrada {
  id: string;
  supplierId?: string;
  createdAt: string;
  detalles: EntradaDetalle[]
  supplier?: Proveedor;


  productos: {
    productId: string;
    productName?: string;
    productCategory?: string;
    quantity: number;
    serialNumbers?: string[];
  }[];
}

export interface EntradaDetalle {
  id: string;
  productId: string;
  quantity: number;

  product: Producto;

  serialNumbers?: {          
    id: string;
    serial: string;
  }[];
}