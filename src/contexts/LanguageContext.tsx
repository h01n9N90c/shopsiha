import React, { createContext, useContext, useState } from 'react';

type Language = 'vi' | 'en';

interface Translations {
  [key: string]: { vi: string; en: string };
}

const translations: Translations = {
  store: { vi: 'Cửa hàng', en: 'Store' },
  dashboard: { vi: 'Bảng điều khiển', en: 'Dashboard' },
  loginAdmin: { vi: 'Đăng nhập Quản trị', en: 'Admin Login' },
  loginUser: { vi: 'Đăng nhập Khách', en: 'User Login' },
  logout: { vi: 'Đăng xuất', en: 'Logout' },
  cart: { vi: 'Giỏ hàng', en: 'Cart' },
  checkout: { vi: 'Thanh toán', en: 'Checkout' },
  total: { vi: 'Tổng cộng', en: 'Total' },
  orders: { vi: 'Đơn hàng', en: 'Orders' },
  inventory: { vi: 'Tồn kho', en: 'Inventory' },
  analytics: { vi: 'Phân tích', en: 'Analytics' },
  chat: { vi: 'Hỗ trợ', en: 'Support' },
  track_order: { vi: 'Theo dõi đơn hàng', en: 'Track Order' },
  add_to_cart: { vi: 'Thêm vào giỏ', en: 'Add to Cart' },
  pay_now: { vi: 'Thanh toán ngay', en: 'Pay Now' },
  push_notification: { vi: 'Thông báo', en: 'Notifications' },
  revenue: { vi: 'Doanh thu', en: 'Revenue' },
  customers: { vi: 'Khách hàng', en: 'Customers' },
  recent_orders: { vi: 'Đơn hàng gần đây', en: 'Recent Orders' },
  status_pending: { vi: 'Chờ xử lý', en: 'Pending' },
  status_processing: { vi: 'Đang chuẩn bị', en: 'Processing' },
  status_shipped: { vi: 'Đang giao', en: 'Shipped' },
  status_delivered: { vi: 'Đã giao', en: 'Delivered' },
  stock_out: { vi: 'Hết hàng', en: 'Out of Stock' },
  secure_payment: { vi: 'Thanh toán bảo mật', en: 'Secure Payment' },
};

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('vi');

  const toggleLang = () => setLang(prev => prev === 'vi' ? 'en' : 'vi');

  const t = (key: string) => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
