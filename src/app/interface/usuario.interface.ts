export type UserStatus = 'Habilitado' | 'Deshabilitado';

export interface Usuario {
    id?: string;
    nombre: string;
    lastname: string;
    email: string;
    dni: number;
    password: string;
    role: 'Administrador' | 'Almacenero';
    status?: UserStatus;
    createdAt?: string;
    updatedAt?: string;
}