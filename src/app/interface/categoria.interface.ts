export interface Categoria {
    id?: string;
    name: string;
    description: string;
    createAt?: string;
    updateAt?: string;
    subcategories?: any[];
    products?: any[]
}