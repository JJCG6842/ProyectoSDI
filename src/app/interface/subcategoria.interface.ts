export interface Subcategoria {
    id?: string;

    name: string;
    description: string;

    categoryIds?: string[];

    createAt?: string;
    updateAt?: string;

    categories?: {
        id: string;
        name: string;
    }[];
}