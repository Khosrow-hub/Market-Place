export interface Product {
  id: string;
  name: string;
  nameDari?: string;
  description: string;
  descriptionDari?: string;
  price: number;
  currency: 'USD' | 'AFN' | 'EUR';
  images: string[];
  category: string;
  subCategory?: string;
  seller: string;
  amazonProductId?: string;
  alibabaProductId?: string;
  amazonUrl?: string;
  alibabaUrl?: string;
  source: 'amazon' | 'alibaba' | 'both';
  stock: number;
  condition: 'new' | 'used' | 'refurbished';
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
  specifications?: Record<string, string>;
  location?: {
    city?: string;
    country?: string;
  };
  shippingInfo?: {
    freeShipping?: boolean;
    shippingCost?: number;
    estimatedDelivery?: string;
  };
  returnPolicy?: string;
  createdAt: string;
}