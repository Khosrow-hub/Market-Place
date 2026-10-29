export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: Address;
  language: 'dari' | 'pashto' | 'english';
  role: 'user' | 'seller' | 'admin' | 'owner';
  avatar?: string;
  amazonId?: string;
  alibabaId?: string;
  isVerified: boolean;
  totalPurchases: number;
  totalSpent: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  address?: Address;
  language?: 'dari' | 'pashto' | 'english';
  role?: 'user' | 'seller' | 'admin' | 'owner';
}