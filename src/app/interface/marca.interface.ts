export interface Marca {
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