export interface Car {
  id?: number;
  make: string;
  model: string;
  features: string;
  vin: string;
  price: number;
  location: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
  user: {
    id?: number;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
  };
}