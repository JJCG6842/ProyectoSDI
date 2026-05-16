import { Categoria } from "./categoria.interface";
import { Marca } from "./marca.interface";
import { Subcategoria } from "./subcategoria.interface";
import { Almacen } from "./almacen.interface";

export interface Producto {
  id: string;

  image: string;
  name: string;
  description: string;

  marcaId?: string;

  quantity: number;

  status: 'Instock' | 'Outstock';

  model: string;

  categoryId: string;
  subcategoryId: string;

  almacenId: string;

  createAt: Date;
  updateAt: Date;

  state?: 'Habilitado' | 'Deshabilitado';

  category?: Categoria;
  subcategory?: Subcategoria;
  marca?: Marca;

  almacen?: Almacen;
}

