export interface Proveedor {
  id: string;
  name: string;
  phone: number;
  ruc: string;
  address: string;
  description: string;
  createdAt?: string;
  updatedAt?: string; 
  entrance?: any[];
}