import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { ServiceProvider, useServices } from './contexts/ServiceContext';

import { StoreFront } from './components/StoreFront';
import { AdminDashboard } from './components/AdminDashboard';
import { ChatWidget } from './components/ChatWidget';
import { LanguageToggle } from './components/LanguageToggle';
import { LoginPage }  from './pages/LoginPage';
import { AboutPage }  from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';

import { UserCircle, LogOut, ShieldCheck, ShoppingCart, Search, Menu, Bell, Package, CheckCircle2, ChevronRight, Heart, Calendar, Instagram, Camera } from 'lucide-react';

const TopNav = () => {
  const { user, logout } = useAuth();
  const { lang, t } = useLanguage();
  const { totalQuantity } = useCart();
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { items, totalPrice, clearCart } = useCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const { orderService } = useServices();

  const [startDate, setStartDate] = useState(() => {
     const today = new Date();
     return today.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
     const tomorrow = new Date();
     tomorrow.setDate(tomorrow.getDate() + 1);
     return tomorrow.toISOString().split('T')[0];
  });

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const handlePresetDays = (days: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + days);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleCheckout = async () => {
    if (user) {
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      const totalAmount = totalPrice * calculateDays();
      try {
        await orderService.createOrder(
          user.id, 
          orderItems, 
          totalAmount, 
          startDate, 
          endDate, 
          user.profile?.address || 'Nhận đồ tại cửa hàng'
        );
      } catch (err) {
        console.error("Failed to create order on checkout:", err);
      }
    }
    setCheckoutComplete(true);
    clearCart();
    setTimeout(() => {
       setCheckoutComplete(false);
       setShowCartDrawer(false);
    }, 3000);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-rose-100/50 shadow-[0_4px_20px_rgba(225,29,72,0.03)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-[10px] font-medium border-b border-rose-50 text-zinc-400 uppercase tracking-widest hidden md:flex">
             <div className="flex gap-8">
               <span className="hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1.5"><Instagram size={12}/> @SIHA.Boutique</span>
               <span className="hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1.5"><Camera size={12}/> @tits.digital</span>
             </div>
             <div className="flex gap-6 items-center">
               <LanguageToggle />
               {user ? (
                  <div className="flex items-center gap-4">
                     <Link to="/profile" className="flex items-center gap-1.5 font-bold text-zinc-700 hover:text-rose-550 transition-colors bg-rose-50/50 px-3 py-1 bg-rose-50/60 rounded-full border border-rose-100/30 shadow-sm"><UserCircle size={14} className="text-rose-400"/> {user.name}</Link>
                     {user.role === 'admin' && <Link to="/admin" className="hover:text-rose-500 transition-colors flex items-center gap-1.5"><ShieldCheck size={14}/> {t('dashboard')}</Link>}
                     <button onClick={logout} className="hover:text-rose-500 transition-colors flex items-center gap-1.5"><LogOut size={14}/>Thoát</button>
                  </div>
               ) : (
                  <Link to="/login" className="font-bold hover:text-rose-500 transition-colors">Đăng Ký / Đăng Nhập</Link>
               )}
             </div>
          </div>

          <div className="h-16 md:h-24 flex items-center justify-between py-2 md:py-3">
            <Link to="/" className="flex items-center gap-1.5 md:gap-3 tracking-wide shrink-0 font-serif text-zinc-900 group">
              <div className="bg-rose-50/70 p-1.5 md:p-2.5 rounded-full group-hover:bg-rose-100 transition-all border border-rose-100/40 flex items-center justify-center shadow-sm">
                 <Heart className="w-3.5 h-3.5 md:w-5 md:h-5 fill-rose-400 text-rose-400"/>
              </div>
              <span className="font-serif tracking-[0.14em] font-extrabold text-[15px] md:text-2xl uppercase">
                SIHA <span className="font-light tracking-[0.05em] text-[12px] md:text-lg text-zinc-400 lowercase italic">boutique</span>
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-12 font-bold text-zinc-700 text-[11px] uppercase tracking-[0.2em]">
               <Link to="/" className="hover:text-rose-500 transition-colors relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-rose-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Trang Chủ</Link>
               <a href="/#product-list" onClick={(e) => {
                  if (window.location.pathname === '/') {
                     e.preventDefault();
                     document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' });
                  }
               }} className="hover:text-rose-500 transition-colors relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-rose-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Bộ Sưu Tập</a>
               <a href="/#product-list" onClick={(e) => {
                  if (window.location.pathname === '/') {
                     e.preventDefault();
                     document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' });
                  }
               }} className="text-rose-500 transition-colors relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-rose-400 after:scale-x-100">Bảng Giá Thuê</a>
               <Link to="/about" className="hover:text-rose-500 transition-colors relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-rose-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Về SIHA</Link>
            </div>

            <div className="flex items-center gap-1.5 md:gap-4">
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-50 text-zinc-600 transition-colors">
                <Search size={18} />
              </button>
              <button onClick={() => setShowCartDrawer(true)} className="relative flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500 hover:scale-[1.03] text-white rounded-full transition-all group shadow-[0_4px_18px_rgba(225,29,72,0.22)] hover:shadow-[0_6px_22px_rgba(225,29,72,0.35)] active:scale-95 duration-300 h-9 md:h-11 border border-rose-400/20">
                 <ShoppingCart size={15} className="group-hover:rotate-12 transition-transform duration-300"/>
                 <span className="hidden md:inline text-[10px] md:text-xs font-black uppercase tracking-widest font-serif">Tủ Đồ</span>
                 {totalQuantity > 0 && (
                   <span className="bg-white text-rose-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md ml-1 font-mono">
                     {totalQuantity}
                   </span>
                 )}
              </button>
              <button onClick={() => setShowMobileMenu(true)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-800 transition-all hover:bg-zinc-100">
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
         <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end backdrop-blur-md transition-all lg:hidden">
            <div className="w-full bg-white max-h-[85vh] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-bottom relative overflow-hidden">
               <div className="p-6 border-b border-rose-100 flex justify-between items-center bg-white text-zinc-800">
                 <span className="flex items-center gap-2 font-serif text-xl font-bold uppercase tracking-widest"><Heart className="text-rose-400" size={20}/> MENU CỦA NÀNG</span>
                 <button onClick={() => setShowMobileMenu(false)} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500 bg-zinc-50 border border-zinc-100 px-4 py-2 rounded-full hover:bg-rose-50 hover:border-rose-100 transition-all">Đóng</button>
               </div>
               <div className="flex-1 overflow-y-auto bg-[#fafafa] flex flex-col px-6 py-6">
                  <div className="flex flex-col gap-6 font-bold text-zinc-700 text-sm uppercase tracking-widest">
                     <Link to="/" onClick={() => setShowMobileMenu(false)} className="border-b border-rose-50 pb-4 flex items-center justify-between hover:text-rose-500 transition-colors">
                        Trang Chủ <ChevronRight size={16} className="text-zinc-300"/>
                     </Link>
                     <a href="/#product-list" onClick={(e) => {
                        if (window.location.pathname === '/') {
                           e.preventDefault();
                           document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' });
                           setShowMobileMenu(false);
                        }
                     }} className="border-b border-rose-50 pb-4 flex items-center justify-between hover:text-rose-500 transition-colors">
                        Bộ Sưu Tập <ChevronRight size={16} className="text-zinc-300"/>
                     </a>
                     <a href="/#product-list" onClick={(e) => {
                        if (window.location.pathname === '/') {
                           e.preventDefault();
                           document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' });
                           setShowMobileMenu(false);
                        }
                     }} className="border-b border-rose-50 pb-4 flex items-center justify-between text-rose-500 transition-colors">
                        Bảng Giá Thuê <ChevronRight size={16} className="text-rose-300"/>
                     </a>
                     <Link to="/about" onClick={() => setShowMobileMenu(false)} className="border-b border-rose-50 pb-4 flex items-center justify-between hover:text-rose-500 transition-colors">
                        Về SIHA <ChevronRight size={16} className="text-zinc-300"/>
                     </Link>
                  </div>
                  
                  <div className="mt-8 pt-8 space-y-5">
                     <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2rem]">Kết nối</div>
                     <div className="flex gap-6">
                        <span className="hover:text-rose-500 text-zinc-600 transition-colors cursor-pointer flex items-center gap-2"><Instagram size={18}/> @SIHA.Boutique</span>
                     </div>
                     <div className="flex gap-6">
                        <span className="hover:text-rose-500 text-zinc-600 transition-colors cursor-pointer flex items-center gap-2"><Camera size={18}/> @tits.digital</span>
                     </div>
                  </div>
                  
                  <div className="mt-8">
                     {user ? (
                        <div className="flex flex-col gap-4">
                           <Link to="/profile" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2.5 font-bold text-zinc-700 bg-white hover:text-rose-500 p-4 rounded-xl border border-rose-100 shadow-sm transition-colors"><UserCircle size={18} className="text-rose-400"/> {user.name}</Link>
                           <button onClick={() => { logout(); setShowMobileMenu(false); }} className="bg-zinc-100 text-zinc-600 font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-colors uppercase tracking-widest text-xs">Đăng xuất</button>
                        </div>
                     ) : (
                        <Link to="/login" onClick={() => setShowMobileMenu(false)} className="bg-zinc-900 text-white font-bold py-4 rounded-xl w-full block text-center uppercase tracking-widest text-xs shadow-md">Đăng Ký / Đăng Nhập</Link>
                     )}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Cart Drawer */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/20 z-50 flex justify-end backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right relative">
            
            {checkoutComplete ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#fafafa]">
                 <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 mb-8 shadow-sm border border-rose-100">
                    <CheckCircle2 size={48} className="animate-pulse"/>
                 </div>
                 <h2 className="text-2xl font-bold text-zinc-800 mb-4 font-serif uppercase tracking-widest">Hoàn Tất Đặt Chỗ</h2>
                 <p className="text-zinc-500 mb-10 max-w-[280px] leading-relaxed text-sm">Cảm ơn nàng đã lựa chọn SIHA Boutique. Chúng tôi đã gửi email xác nhận chi tiết về thời gian nhận và trả đồ.</p>
                 <button onClick={() => setShowCartDrawer(false)} className="px-10 py-3.5 bg-zinc-900 text-white font-bold text-sm uppercase tracking-widest rounded-full hover:bg-rose-500 shadow-xl shadow-zinc-900/10 transition-colors">Tiếp Tục Khám Phá</button>
              </div>
            ) : (
              <>
                <div className="p-6 font-bold border-b border-rose-100 flex justify-between items-center bg-white text-zinc-800">
                  <span className="flex items-center gap-2.5 font-serif text-xl tracking-wide uppercase"><ShoppingCart className="text-rose-500" size={22}/> Tủ Đồ Của Nàng</span>
                  <button onClick={() => setShowCartDrawer(false)} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500 bg-zinc-50 border border-zinc-100 px-4 py-2 rounded-full hover:bg-rose-50 hover:border-rose-100 transition-all">Đóng</button>
                </div>
                <div className="flex-1 overflow-y-auto bg-[#fafafa] flex flex-col">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-rose-200 flex-1">
                       <Heart size={64} className="mb-6 opacity-40 fill-rose-50"/>
                       <p className="font-serif text-lg text-zinc-500 mb-2">Tủ đồ đang trống.</p>
                       <p className="text-sm text-zinc-400">Hãy thêm những thiết kế bạn yêu thích nhé.</p>
                       <button onClick={() => setShowCartDrawer(false)} className="mt-8 px-6 py-2.5 border border-rose-200 text-rose-500 rounded-full text-sm font-medium hover:bg-rose-50 transition-colors">Khám phá ngay</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-4 p-6">
                        {items.map(item => (
                          <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-rose-50 shadow-sm hover:shadow-md transition-shadow group">
                            <img src={item.image} alt="" referrerPolicy="no-referrer" className="w-20 h-20 rounded-xl object-cover border border-zinc-50" />
                            <div className="flex-1 py-1">
                              <div className="font-medium text-[13px] text-zinc-800 line-clamp-2 uppercase tracking-wide group-hover:text-rose-500 transition-colors">{item.name[lang]}</div>
                              <div className="text-zinc-500 text-[11px] mt-1.5 font-medium bg-zinc-50 inline-block px-2.5 py-1 rounded border border-zinc-100 uppercase tracking-widest">SL: {item.quantity}</div>
                            </div>
                            <div className="font-bold text-rose-600 text-base pr-2">${item.price * item.quantity} <span className="text-[10px] text-zinc-400 font-normal uppercase tracking-widest block text-right mt-1">/ ngày</span></div>
                          </div>
                        ))}
                      </div>

                      {/* Rental Date Selection */}
                      <div className="p-6 bg-white mt-auto border-t border-rose-100">
                         <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2 text-zinc-800 font-bold text-sm uppercase tracking-wide font-serif">
                              <Calendar size={18} className="text-rose-400"/> Cài đặt thời gian thuê
                           </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                               <label className="text-[11px] uppercase tracking-widest text-zinc-500 block mb-1.5 font-semibold">Nhận đồ</label>
                               <input 
                                 type="date" 
                                 value={startDate}
                                 onChange={(e) => {
                                    setStartDate(e.target.value);
                                    if (e.target.value > endDate) {
                                       setEndDate(e.target.value);
                                    }
                                 }}
                                 className="w-full bg-[#fafafa] text-sm px-3.5 py-3 rounded-xl border border-rose-100 outline-none text-zinc-700 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all font-medium" 
                               />
                            </div>
                            <div>
                               <label className="text-[11px] uppercase tracking-widest text-zinc-500 block mb-1.5 font-semibold">Trả đồ</label>
                               <input 
                                 type="date" 
                                 value={endDate}
                                 onChange={(e) => {
                                    setEndDate(e.target.value);
                                 }}
                                 min={startDate}
                                 className="w-full bg-[#fafafa] text-sm px-3.5 py-3 rounded-xl border border-rose-100 outline-none text-zinc-700 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all font-medium" 
                               />
                            </div>
                         </div>

                         <div>
                            <label className="text-[11px] uppercase tracking-widest text-zinc-500 block mb-2.5 font-semibold">Gợi ý lộ trình</label>
                            <div className="flex flex-wrap gap-2.5">
                               {[1, 2, 3, 5, 7].map(days => (
                                 <button
                                    key={days}
                                    onClick={() => handlePresetDays(days)}
                                    className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all ${calculateDays() === days ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'bg-white text-zinc-500 border border-zinc-200 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50'}`}
                                 >
                                    {days} Ngày
                                 </button>
                               ))}
                            </div>
                         </div>
                         
                         <div className="mt-6 pt-4 border-t border-rose-50 flex justify-between items-center text-sm">
                            <span className="text-zinc-600 font-medium">Tổng số ngày thuê:</span>
                            <span className="text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">{calculateDays()} ngày</span>
                         </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 border-t border-rose-100 bg-white relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-end mb-6 bg-[#fafafa] border border-rose-50 p-5 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-1">Tổng thanh toán:</span>
                      <span className="text-zinc-400 text-xs">({totalQuantity} món x {calculateDays()} ngày)</span>
                    </div>
                    <span className="text-3xl font-bold text-rose-600">${totalPrice * calculateDays()}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                    className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-rose-600 disabled:bg-zinc-100 disabled:text-zinc-300 disabled:cursor-not-allowed transition-colors shadow-xl shadow-zinc-900/10 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                  >
                    Thanh Toán & Đặt Chỗ <ChevronRight size={18}/>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <ServiceProvider>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="min-h-screen font-sans flex flex-col bg-pink-50/20 text-zinc-800">
                <TopNav />
                <main className="flex-1 w-full">
                  <Routes>
                    <Route path="/" element={<StoreFront />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </main>
                <footer className="bg-white pt-16 pb-8 border-t border-rose-100 mt-auto relative z-10">
                  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                     <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 font-bold text-2xl tracking-wide font-serif text-zinc-900 mb-6 uppercase">
                          <Heart size={20} className="text-rose-400 fill-rose-50"/> SIHA Boutique
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6">
                           Điểm đến của sự thanh lịch và sang trọng. Chúng tôi mang đến trải nghiệm tiếp cận thời trang cao cấp, thiết kế dạ hội và phụ kiện độc bản với chi phí tối ưu nhất.
                        </p>
                        <div className="flex gap-4 text-zinc-400">
                           <a href="#" className="hover:text-rose-500 transition-colors"><div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-rose-50 hover:border-rose-100 border border-zinc-100">FB</div></a>
                           <a href="#" className="hover:text-rose-500 transition-colors"><div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-rose-50 hover:border-rose-100 border border-zinc-100">IG</div></a>
                           <a href="#" className="hover:text-rose-500 transition-colors"><div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-rose-50 hover:border-rose-100 border border-zinc-100">TT</div></a>
                        </div>
                     </div>
                     
                     <div>
                        <h4 className="font-bold text-zinc-800 mb-6 font-serif uppercase tracking-widest text-sm">Dịch Vụ</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                           <li><a href="#" className="hover:text-rose-500 transition-colors">Thuê thiết kế dạ hội</a></li>
                           <li><a href="#" className="hover:text-rose-500 transition-colors">Túi xách & Đồ Brand</a></li>
                           <li><a href="#" className="hover:text-rose-500 transition-colors">Máy ảnh Film cổ điển</a></li>
                           <li><a href="#" className="hover:text-rose-500 transition-colors">Ship hỏa tốc toàn quốc</a></li>
                        </ul>
                     </div>

                     <div>
                        <h4 className="font-bold text-zinc-800 mb-6 font-serif uppercase tracking-widest text-sm">Thông Tin</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                           <li className="hover:text-rose-500 cursor-pointer transition-colors"><Link to="/about">Câu chuyện SIHA</Link></li>
                           <li className="hover:text-rose-500 cursor-pointer transition-colors">CN1: Gò Vấp, SG</li>
                           <li className="hover:text-rose-500 cursor-pointer transition-colors">CN2: Quận 12, SG</li>
                           <li className="hover:text-rose-500 cursor-pointer transition-colors">Hotline: 0909 123 456</li>
                        </ul>
                     </div>
                  </div>
                  
                  <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-rose-50 text-center text-[11px] text-zinc-400 font-medium tracking-widest uppercase flex flex-col md:flex-row justify-between items-center gap-4">
                     <p>© 2026 SIHA Boutique. All rights reserved.</p>
                     <div className="flex gap-6">
                        <a href="#" className="hover:text-rose-500 transition-colors">Điều khoản dịch vụ</a>
                        <a href="#" className="hover:text-rose-500 transition-colors">Chính sách bảo mật</a>
                     </div>
                  </div>
                </footer>
                <ChatWidget />
              </div>
            </BrowserRouter>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </ServiceProvider>
  );
}

