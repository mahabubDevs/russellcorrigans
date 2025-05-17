import { ProductStatus } from "@prisma/client";

export interface CreatePropertyInterface {
  id: string;
  address: string;
  location: string;
  lat ?: number;
  lng ?: number;
  perimeter: number;
  area: number;

  
  userId: string; // Add userId here
 
  
 

  basePrice: number;
  createdAt?: Date;
}


export interface PropertyResponse {
  address: string;
  location: string;
  basePrice: number;
}
















