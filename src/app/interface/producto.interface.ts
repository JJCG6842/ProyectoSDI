import { Categoria } from "./categoria.interface";
import { Marca } from "./marca.interface";
import { Subcategoria } from "./subcategoria.interface";

export interface Producto {
  id: string;
  image: string;
  name: string;
  description: string;
  marcaId: string;
  price: number;
  quantity: number;
  status: 'Instock' | 'Outstock';
  model: string;
  categoryId: string;
  subcategoryId: string;
  storeId?: string;
  createAt: Date;
  updateAt: Date;
  category?: Categoria;
  subcategory?: Subcategoria
  marca?: Marca
}