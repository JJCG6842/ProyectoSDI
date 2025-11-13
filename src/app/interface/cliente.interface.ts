export interface Cliente {
  id: string;
  dni: number;
  name: string;
  phone: number;
  createdAt?: string;
  updatedAt?: string; 
  salida?: any[]
}