import { Producto } from "./producto.interface";
import { Proveedor } from "./proveedor.interface";
import { GuiaRemision } from "./guia_remision";

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

  guia?: {
    id: string;
    numero: string;
  };
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