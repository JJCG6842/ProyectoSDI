export interface Subcategoria {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    createdAt?: string;
    updateAt?: string;
    category: {
        id:string;
        name:string;
    };
}