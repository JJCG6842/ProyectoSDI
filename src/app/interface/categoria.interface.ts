export interface Categoria {
    id?: string;
    name: string;
    description: string;
    createdAt?: string;
    updateAt?: string;
    subcategories?: any[];
    products?: any[]
}