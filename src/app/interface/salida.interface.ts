import { Proveedor } from "./proveedor.interface";
import { Cliente } from "./cliente.interface";
import { Producto } from "./producto.interface";
import { TipoSalida } from "../environments/tipos-salida.type";

export interface Salida {
  id: string;
  tipo: 'cliente' | 'proveedor'; 
  tiposalida: TipoSalida;
  supplierId?: string | null
  clienteId?: string | null
  createdAt: string;

  supplier?: Proveedor;
  cliente?: Cliente;
  productos: Producto[];
  detalles: SalidaDetalle[];
}

export interface SalidaDetalle {
  id: string;
  salidaId: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  product: Producto;
}
