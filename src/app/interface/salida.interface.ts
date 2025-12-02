import { Producto } from "./producto.interface";
import { Usuario } from "./usuario.interface";

export interface Salida {
  id: string;
  createdAt: string;
  userId: string;
  destinoId?: string;
  user?: Usuario;
  destino?: Usuario;     
  detalles: SalidaDetalle[];
}

export interface SalidaDetalle {
  id: string;
  salidaId: string;
  productId: string;
  quantity: number;
  product: Producto;
}