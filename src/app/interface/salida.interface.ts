import { Producto } from "./producto.interface";
import { Proveedor } from "./proveedor.interface";
import { Cliente } from "./cliente.interface";

export interface Salida {
    id: string;
    productId: string;
    quantity: number;
    supplierId?: string;
    clienteId?: string
    createdAt: string;
    product: Producto;
    supplier?: Proveedor;
    cliente?: Cliente;
}