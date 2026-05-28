export type UserRole = 'admin' | 'user' | 'guest';

export interface UserProfileFields {
  phone?: string;
  address?: string;
  gender?: string;
  height?: string; // cm
  weight?: string; // kg
  dressSize?: 'S' | 'M' | 'L' | 'XL';
  shoeSize?: string;
  preferredStyle?: string;
  receiveNotifications?: boolean;
  receiveEmails?: boolean;
  currency?: 'USD' | 'VND';
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  profile?: UserProfileFields;
}

export interface Category {
  id: string;
  name: { vi: string; en: string };
  icon: string;
}

export interface Product {
  id: string;
  name: { vi: string; en: string };
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  categoryId: string;
  rating: number;
  soldCount: number;
  isFlashSale?: boolean;
}
/* THÊM ĐOẠN NÀY */
export interface CartItem extends Product {
  quantity: number;
}
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
  startDate?: string;
  endDate?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
