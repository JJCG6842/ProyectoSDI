export interface Proveedor {
  id: string;
  name: string;
  phone: number;
  description: string;
  createdAt?: string;
  updatedAt?: string; 
  entrance?: any[];
}