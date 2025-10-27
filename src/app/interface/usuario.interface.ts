export interface Usuario {
    id?: string;
    nombre: string;
    password: string;
    role: 'Administrador' | 'Almacenero';
    createdAt?: string;
    updatedAt?: string;
}