export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  imageUrl: string;
  colors?: string[];
  sizes?: string[];
  designFile?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}