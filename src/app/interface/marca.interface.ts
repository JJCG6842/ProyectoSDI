export interface Marca {
    id: string;
    name: string;
    description: string;
    createAt?: string;
    updateAt?: string;
    category: {
        id:string;
        name:string;
    };
}