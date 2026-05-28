import { Product, Order, Category } from './types';

export const mockCategories: Category[] = [
  { id: 'c1', name: { vi: 'Thuê đồ Brand', en: 'Brand Clothes Rental' }, icon: 'Shirt' },
  { id: 'c2', name: { vi: 'Thuê Máy Ảnh', en: 'Camera Rental' }, icon: 'Camera' },
  { id: 'c3', name: { vi: 'Phụ Kiện', en: 'Accessories' }, icon: 'Sparkles' },
  { id: 'c4', name: { vi: 'Giày / Dép', en: 'Shoes' }, icon: 'ShoppingBag' },
];

export const mockProducts: Product[] = [
  { id: 'p1', name: { vi: 'Đầm xòe dạ hội Woaa Stu', en: 'Woaa Stu Party Dress' }, price: 60, originalPrice: 650, stock: 5, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80', categoryId: 'c1', rating: 4.9, soldCount: 154, isFlashSale: true },
  { id: 'p2', name: { vi: 'Máy Ảnh Canon M50 MII', en: 'Canon M50 MII Camera' }, price: 150, stock: 2, image: 'https://images.unsplash.com/photo-1502920917128-1da500764c6e?auto=format&fit=crop&w=600&q=80', categoryId: 'c2', rating: 5.0, soldCount: 42 },
  { id: 'p3', name: { vi: 'Váy Midi Vintage Lofi', en: 'Vintage Lofi Midi Dress' }, price: 40, stock: 10, image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=600&q=80', categoryId: 'c1', rating: 4.8, soldCount: 89 },
  { id: 'p4', name: { vi: 'Máy Ảnh Film Pentax K1000', en: 'Pentax K1000 Film Camera' }, price: 80, originalPrice: 120, stock: 3, image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=600&q=80', categoryId: 'c2', rating: 4.9, soldCount: 75, isFlashSale: true },
  { id: 'p5', name: { vi: 'Túi xách ngọc trai đính đá', en: 'Pearl Beaded Handbag' }, price: 15, stock: 20, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', categoryId: 'c3', rating: 4.7, soldCount: 200, isFlashSale: true },
  { id: 'p6', name: { vi: 'Váy Cúp Ngực Công Chúa', en: 'Princess Corset Dress' }, price: 55, stock: 8, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80', categoryId: 'c1', rating: 4.6, soldCount: 130 },
  { id: 'p7', name: { vi: 'Máy Ảnh Ricoh GR III', en: 'Ricoh GR III Camera' }, price: 200, stock: 1, image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80', categoryId: 'c2', rating: 5.0, soldCount: 15 },
  { id: 'p8', name: { vi: 'Vòng Cổ Choker Ruy Băng', en: 'Ribbon Choker Necklace' }, price: 5, stock: 50, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', categoryId: 'c3', rating: 4.8, soldCount: 560 },
];

export const mockOrders: Order[] = [
  { id: 'ORD-001', userId: 'user-1', items: [{ productId: 'p1', quantity: 1, price: 299 }], total: 299, status: 'delivered', createdAt: '2026-05-20T10:00:00Z', shippingAddress: '123 Main St' },
  { id: 'ORD-002', userId: 'user-2', items: [{ productId: 'p2', quantity: 2, price: 199 }], total: 398, status: 'processing', createdAt: '2026-05-22T14:30:00Z', shippingAddress: '456 Oak Rd' },
  { id: 'ORD-003', userId: 'user-1', items: [{ productId: 'p4', quantity: 1, price: 89 }], total: 89, status: 'shipped', createdAt: '2026-05-23T09:15:00Z', shippingAddress: '123 Main St' },
];
