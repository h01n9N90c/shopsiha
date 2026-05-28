import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Order, Product } from '../types';
import { 
  User as UserIcon, Settings, Calendar, Ruler, Sparkles, CheckCircle2, 
  MapPin, Phone, Mail, Award, Heart, ShieldCheck, Ticket, HelpCircle, Save, LogOut, ChevronRight
} from 'lucide-react';

const LIVE_LOGS_POOL = [
  "Hệ thống định vị chiều cao và vóc dáng để thiết kế nẹp gông hoàn hảo.",
  "Chuyên gia thời trang đính hạt đá pha lê nổi Swarovski lấp lánh thủ công.",
  "Dùng máy là hơi nước xông sấy tinh chất hoa oải hương làm dịu thớ vải tự nhiên.",
  "Kiểm tra lại đường viền lót nhung satin đỏ kiêu sa chống vướng tà váy.",
  "Đóng gói xếp váy vào hộp giấy sinh thái nẹp bông vai giữ form tuyệt đối.",
  "Soạn thiệp cảm ơn đề bút tay từ Giám đốc sáng chế SIHA Boutique.",
  "Bàn giao shipper công nghệ giao hỏa tốc đến địa chỉ yêu quý của nàng.",
  "Cập nhật: Tài xế ô tô báo quãng đường thông thoáng, đang tăng đốc giao hàng.",
  "Kiểm định chất lượng ủi ly vạt váy trước khi xuất kho chuẩn chỉ."
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { orderService, productService } = useServices();
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'rentals' | 'settings'>('profile');
  
  // Real-time synchronization state
  const [ordersRefresh, setOrdersRefresh] = useState(0);

  // Real-time Order Tracking states
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [liveLogs, setLiveLogs] = useState<{ time: string; text: string; category: string }[]>([]);
  const [logsProgress, setLogsProgress] = useState(0);
  const [simulationActive, setSimulationActive] = useState(true);

  // Local form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Nữ');
  const [height, setHeight] = useState('160');
  const [weight, setWeight] = useState('50');
  const [dressSize, setDressSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [shoeSize, setShoeSize] = useState('37');
  const [preferredStyle, setPreferredStyle] = useState('Parisian Chic');
  
  // Setting states
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [receiveEmails, setReceiveEmails] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'VND'>('VND');
  const [avatar, setAvatar] = useState('');
  const [themeColor, setThemeColor] = useState<string>('rose');

  // Orders and associated products
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsMap, setProductsMap] = useState<Record<string, Product>>({});
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.profile?.phone || '');
      setAddress(user.profile?.address || '');
      setGender(user.profile?.gender || 'Nữ');
      setHeight(user.profile?.height || '160');
      setWeight(user.profile?.weight || '50');
      setDressSize(user.profile?.dressSize || 'M');
      setShoeSize(user.profile?.shoeSize || '37');
      setPreferredStyle(user.profile?.preferredStyle || 'Parisian Chic');
      setReceiveNotifications(user.profile?.receiveNotifications ?? true);
      setReceiveEmails(user.profile?.receiveEmails ?? false);
      setCurrency(user.profile?.currency || 'VND');
      setAvatar(user.profile?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}`);
      
      // Fetch user specific bookings
      orderService.getOrdersByUser(user.id).then(userOrders => {
        setOrders(userOrders);
      });
    }
  }, [user, orderService, ordersRefresh]);

  useEffect(() => {
    const handleUpdate = () => {
      setOrdersRefresh(prev => prev + 1);
    };
    window.addEventListener('siha_orders_updated', handleUpdate);
    return () => {
      window.removeEventListener('siha_orders_updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    // Collect all products for quick lookup
    productService.getAllProducts().then(allProducts => {
      const map: Record<string, Product> = {};
      allProducts.forEach(p => {
        map[p.id] = p;
      });
      setProductsMap(map);
    });
  }, [productService]);

  const initializeLiveLogs = (order: Order) => {
    const defaultLogs = [
      { time: "0 phút trước", text: "Xác thực chữ ký hợp đồng số SIHA-SECURE và duyệt cọc hóa đơn.", category: "Bảo mật hệ thống" },
      { time: "2 phút trước", text: "Kiểm tra kích cỡ size váy tối ưu vừa vặn số đo " + (height || "160") + "cm | " + (weight || "50") + "kg của nàng.", category: "Tư vấn vóc dáng" }
    ];

    if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      defaultLogs.unshift({ time: "Vừa xong", text: "Tiến hành hấp sấy khử trùng hơi ấm thơm tinh khôi oải hương.", category: "Vệ sinh cao cấp" });
    }
    if (order.status === 'shipped' || order.status === 'delivered') {
      defaultLogs.unshift({ time: "Đang vận chuyển", text: "Váy đã bàn giao shipper Ahamove chạy hỏa tốc đến địa chỉ nhận đồ.", category: "Logistics" });
    }
    if (order.status === 'delivered') {
      defaultLogs.unshift({ time: "Giao thành công", text: "Váy đầm hạ cánh an toàn! SIHA chúc quý cô tỏa sáng rực rỡ nhất tại bữa tiệc phong thái.", category: "Hoàn tất" });
    }

    setLiveLogs(defaultLogs);

    let startProgress = 15;
    if (order.status === 'processing') startProgress = 45;
    if (order.status === 'shipped') startProgress = 78;
    if (order.status === 'delivered') startProgress = 100;
    setLogsProgress(startProgress);
  };

  useEffect(() => {
    if (!trackingOrder || !simulationActive) return;
    if (trackingOrder.status === 'delivered' || trackingOrder.status === 'cancelled') return;

    const interval = setInterval(() => {
      const text = LIVE_LOGS_POOL[Math.floor(Math.random() * LIVE_LOGS_POOL.length)];
      setLiveLogs(prev => [
        { time: "Vừa xong", text, category: "SIHA Boutique" },
        ...prev.map(item => ({
          ...item,
          time: item.time === "Vừa xong" ? "1 phút trước" : item.time === "1 phút trước" ? "2 phút trước" : item.time
        }))
      ]);

      setLogsProgress(prev => {
        if (prev < 95) {
          return prev + Math.floor(Math.random() * 5 + 3);
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [trackingOrder, simulationActive, height, weight]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    
    updateProfile({
      phone,
      address,
      gender,
      height,
      weight,
      dressSize,
      shoeSize,
      preferredStyle,
      receiveNotifications,
      receiveEmails,
      currency,
      avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.email || '')}`
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/50 shadow-xl text-center">
         <Heart size={48} className="text-rose-400 mx-auto fill-rose-50 mb-4 animate-bounce"/>
         <h2 className="text-2xl font-serif font-bold text-zinc-800 mb-2 uppercase">Chưa Đăng Nhập</h2>
         <p className="text-zinc-500 mb-6 text-xs leading-relaxed">Hãy đăng ký hoặc đăng nhập tài khoản SIHA để xem chi tiết thông tin thời trang và lịch sử đặt đồ của nàng.</p>
         <a href="/login" className="inline-block px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:scale-[1.03] transition-all duration-300 shadow-md">Đăng Nhập Ngay</a>
      </div>
    );
  }

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'shipped': return 'bg-cyan-50 text-cyan-600 border border-cyan-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'cancelled': return 'bg-zinc-100 text-zinc-500 border border-zinc-200';
      default: return 'bg-amber-50 text-amber-600 border border-amber-100';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'Đã nhận đồ / Đang thuê';
      case 'shipped': return 'Đang bàn giao shipper';
      case 'processing': return 'Đã xác nhận / Đang chuẩn bị đồ';
      case 'cancelled': return 'Đã hủy đặt chỗ';
      default: return 'Đang xử lý';
    }
  };

  // Theme support
  const getThemeColorClass = () => {
    switch (themeColor) {
      case 'emerald': return 'from-emerald-500 to-teal-600';
      case 'navy': return 'from-indigo-600 to-violet-700';
      case 'gold': return 'from-amber-500 to-yellow-600';
      default: return 'from-rose-500 via-pink-600 to-rose-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      
      {/* Upper header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 md:p-10 text-white shadow-xl mb-12">
         {/* Abstract background graphics */}
         <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-fuchsia-500/10 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex flex-col md:flex-row items-center gap-6">
               <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden flex items-center justify-center shadow-lg relative group">
                     <img 
                       src={avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}`} 
                       alt="" 
                       className="w-full h-full object-cover" 
                     />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] uppercase font-bold cursor-pointer">
                        Đổi ảnh
                     </div>
                  </div>
                  {user.role === 'admin' && (
                     <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-[9px] font-black uppercase px-2.5 py-1 rounded-full border-2 border-zinc-900 shadow-md flex items-center gap-1">
                        <Award size={10}/> Admin
                     </div>
                  )}
               </div>
               
               <div className="text-center md:text-left">
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-[0.25em] font-mono block">Thành viên SIHA</span>
                  <h1 className="text-2xl md:text-3xl font-serif font-semibold mt-1 tracking-tight text-white uppercase">{name || 'Khách Hàng Kiêu Sa'}</h1>
                  <p className="text-zinc-400 text-xs mt-2 font-mono flex items-center justify-center md:justify-start gap-1.5"><Mail size={12}/> {user.email}</p>
               </div>
            </div>

            <div className="flex gap-3 mt-6 md:mt-0">
               <button 
                  onClick={logout} 
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
               >
                  <LogOut size={14}/> Đăng xuất
               </button>
            </div>
         </div>
      </div>

      {/* Main body split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
         
         {/* Navigation menu (Sidebar style) */}
         <div className="col-span-1 bg-white rounded-3xl border border-rose-100/50 shadow-sm p-4 space-y-1.5">
            <button 
               onClick={() => setActiveTab('profile')}
               className={`w-full text-left px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-widest flex items-center gap-3.5 transition-all ${activeTab === 'profile' ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 'text-zinc-500 hover:text-rose-500 hover:bg-rose-50/20'}`}
            >
               <UserIcon size={16}/> Số đo & Hồ sơ
            </button>
            <button 
               onClick={() => setActiveTab('rentals')}
               className={`w-full text-left px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-widest flex items-center justify-between transition-all ${activeTab === 'rentals' ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 'text-zinc-500 hover:text-rose-500 hover:bg-rose-50/20'}`}
            >
               <span className="flex items-center gap-3.5"><Calendar size={16}/> Lịch sử đặt thuê</span>
               {orders.length > 0 && <span className="bg-rose-100 font-mono text-[10px] text-rose-600 font-bold px-2 py-0.5 rounded-full">{orders.length}</span>}
            </button>
            <button 
               onClick={() => setActiveTab('settings')}
               className={`w-full text-left px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-widest flex items-center gap-3.5 transition-all ${activeTab === 'settings' ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 'text-zinc-500 hover:text-rose-500 hover:bg-rose-50/20'}`}
            >
               <Settings size={16}/> Cài đặt riêng
            </button>
         </div>

         {/* Content Area */}
         <div className="col-span-1 lg:col-span-3">
            
            {activeTab === 'profile' && (
               <div className="bg-white rounded-3xl border border-rose-100/50 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom h-full">
                  <div className="flex justify-between items-center pb-5 border-b border-rose-50 mb-6">
                     <div>
                        <h2 className="text-xl font-serif font-black uppercase text-zinc-800 tracking-wide">Số đo & Thông tin kiểm dầm</h2>
                        <p className="text-xs text-zinc-400 mt-1">Cung cấp số đo chiều cao, cân nặng chính xác để SIHA chọn size chuẩn xác nhất cho nàng.</p>
                     </div>
                     <span className="p-2 bg-rose-50/60 rounded-xl text-rose-400"><Ruler size={20}/></span>
                  </div>

                  {saveSuccess && (
                     <div className="p-4 mb-6 bg-green-50 text-green-700 text-xs font-semibold rounded-2xl border border-green-100 text-center flex items-center justify-center gap-2 animate-in fade-in">
                        <CheckCircle2 size={16}/> Hệ thống đã cập nhật số đo và hồ sơ của nàng thành công!
                     </div>
                  )}

                  {/* Premium Silhouette Avatar Badge */}
                  <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-rose-950/20 text-white rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-xl mb-8 flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
                     <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl"></div>
                     <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                           <Sparkles size={24} className="animate-spin" style={{ animationDuration: '4s' }}/>
                        </div>
                        <div>
                           <span className="text-[8px] font-black uppercase tracking-[0.25em] text-rose-400 bg-rose-950 px-2.5 py-1 rounded border border-rose-800/30">SIHA Atelier Profile</span>
                           <h3 className="text-lg font-serif font-black uppercase text-white mt-1.5">Hồ sơ vóc dáng thượng lưu</h3>
                           <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Cơ sở thông tin mẫu chuẩn giúp Atelier tinh chế tà váy vừa khít.</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto relative z-10 font-mono">
                        <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-center">
                           <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Chiều Cao</span>
                           <span className="block text-base font-extrabold text-rose-400 mt-0.5">{height} cm</span>
                        </div>
                        <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-center">
                           <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Cân Nặng</span>
                           <span className="block text-base font-extrabold text-rose-400 mt-0.5">{weight} kg</span>
                        </div>
                        <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-center font-sans">
                           <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider font-mono">Size Váy</span>
                           <span className="block text-base font-black text-rose-400 mt-0.5">{dressSize}</span>
                        </div>
                        <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-center">
                           <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Size Giày</span>
                           <span className="block text-base font-extrabold text-rose-400 mt-0.5">{shoeSize}</span>
                        </div>
                     </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Name */}
                        <div>
                           <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 block mb-1.5">Tên hiển thị</label>
                           <input 
                             type="text" 
                             required
                             value={name}
                             onChange={e => setName(e.target.value)}
                             className="w-full bg-zinc-50/50 outline-none text-sm px-4 py-3.5 rounded-2xl border border-rose-50 hover:bg-white focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all font-semibold" 
                           />
                        </div>

                        {/* Phone */}
                        <div>
                           <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 block mb-1.5">Số điện thoại liên hệ</label>
                           <input 
                             type="tel" 
                             value={phone}
                             onChange={e => setPhone(e.target.value)}
                             placeholder="Chưa cập nhật"
                             className="w-full bg-zinc-50/50 outline-none text-sm px-4 py-3.5 rounded-2xl border border-rose-50 hover:bg-white focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all font-semibold" 
                           />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                           <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 block mb-1.5">Địa chỉ giao nhận đồ</label>
                           <input 
                             type="text" 
                             value={address}
                             onChange={e => setAddress(e.target.value)}
                             placeholder="Địa chỉ cụ thể hoặc chi nhánh nhận đồ tại cửa hàng..."
                             className="w-full bg-zinc-50/50 outline-none text-sm px-4 py-3.5 rounded-2xl border border-rose-50 hover:bg-white focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all font-semibold" 
                           />
                        </div>

                        {/* Height */}
                        <div>
                           <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 block mb-1.5 flex justify-between">
                              Chiều cao <span>{height} cm</span>
                           </label>
                           <div className="flex items-center gap-4 py-2">
                              <input 
                                type="range" 
                                min="140" 
                                max="190"
                                value={height}
                                onChange={e => setHeight(e.target.value)}
                                className="w-full accent-rose-500 h-1.5 bg-rose-50 rounded-lg cursor-pointer" 
                              />
                           </div>
                        </div>

                        {/* Weight */}
                        <div>
                           <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 block mb-1.5 flex justify-between">
                              Cân nặng <span>{weight} kg</span>
                           </label>
                           <div className="flex items-center gap-4 py-2">
                              <input 
                                type="range" 
                                min="35" 
                                max="100"
                                value={weight}
                                onChange={e => setWeight(e.target.value)}
                                className="w-full accent-rose-500 h-1.5 bg-rose-50 rounded-lg cursor-pointer" 
                              />
                           </div>
                        </div>

                        {/* Dress size */}
                        <div>
                           <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 block mb-2">Size váy khuyên dùng</label>
                           <div className="grid grid-cols-4 gap-2.5">
                              {(['S', 'M', 'L', 'XL'] as const).map(size => (
                                 <button
                                    key={size}
                                    type="button"
                                    onClick={() => setDressSize(size)}
                                    className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${dressSize === size ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-100 text-zinc-500 hover:border-rose-200 hover:bg-rose-50/40 hover:text-rose-500'}`}
                                 >
                                    {size}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Shoes size */}
                        <div>
                           <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 block mb-2">Giày / Cao gót (Size)</label>
                           <select 
                             value={shoeSize}
                             onChange={e => setShoeSize(e.target.value)}
                             className="w-full bg-zinc-50/50 outline-none text-sm px-4 py-3.5 rounded-xl border border-rose-50 hover:bg-white focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all font-semibold"
                           >
                              {['35', '36', '37', '38', '39', '40'].map(sz => (
                                 <option key={sz} value={sz}>Size quốc tế: {sz}</option>
                              ))}
                           </select>
                        </div>

                        {/* Vibe prefer */}
                        <div>
                           <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 block mb-1.5">Phong cách cá nhân chính</label>
                           <select 
                             value={preferredStyle}
                             onChange={e => setPreferredStyle(e.target.value)}
                             className="w-full bg-zinc-50/50 outline-none text-sm px-4 py-3.5 rounded-xl border border-rose-50 hover:bg-white focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all font-semibold"
                           >
                              <option value="Cinderella Princess">Cinderella Princess (Công Chúa Bồng Bềnh)</option>
                              <option value="Parisian Chic">Parisian Chic (Đơn Giản Pháp)</option>
                              <option value="Classic Vintage">Classic Vintage (Nàng Thơ Cổ Điển)</option>
                              <option value="Modern Glam">Modern Glam (Gợi Cảm Hiện Đại)</option>
                              <option value="Luxury Queen">Luxury Queen (Dạ Hội Vương Giả)</option>
                           </select>
                        </div>

                        {/* Avatar Picker Choice */}
                        <div>
                          <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 block mb-1.5">Avatar độc bản ngẫu nhiên</label>
                          <div className="flex gap-2">
                             <input 
                               type="text" 
                               value={avatar}
                               onChange={e => setAvatar(e.target.value)}
                               className="w-full bg-zinc-50/50 outline-none text-[11px] px-3.5 py-3 rounded-xl border border-rose-50 hover:bg-white focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all font-semibold" 
                             />
                             <button
                               type="button"
                               onClick={() => setAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.floor(Math.random() * 9999)}`)}
                               className="px-4 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-xs font-bold text-zinc-600 transition-colors uppercase tracking-widest"
                             >
                                Đổi hình
                             </button>
                          </div>
                        </div>

                     </div>

                     <div className="pt-6 border-t border-rose-50 text-right">
                        <button 
                           type="submit" 
                           className="px-8 py-3.5 bg-zinc-900 text-white hover:bg-rose-600 active:scale-95 transition-all outline-none rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 inline-flex"
                        >
                           <Save size={14}/> Lưu Thông Tin & Số Đo
                        </button>
                     </div>
                  </form>
               </div>
            )}

            {activeTab === 'rentals' && (
               <div className="bg-white rounded-3xl border border-rose-100/50 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom">
                  <div className="flex justify-between items-center pb-5 border-b border-rose-50 mb-6">
                     <div>
                        <h2 className="text-xl font-serif font-black uppercase text-zinc-800 tracking-wide">Danh sách đặt thuê dạ hội</h2>
                        <p className="text-xs text-zinc-400 mt-1">Nàng có thể kiểm tra danh sách hợp đồng đặt cọc thời trang, trạng thái xử lý đơn hàng tại đây.</p>
                     </div>
                     <span className="p-2 bg-rose-50/60 rounded-xl text-rose-400"><Calendar size={20}/></span>
                  </div>

                  {orders.length === 0 ? (
                     <div className="text-center py-16 text-zinc-300">
                        <Heart size={48} className="mx-auto block opacity-20 mb-4"/>
                        <p className="text-sm font-serif font-bold text-zinc-400">Nàng chưa có đơn thuê nào</p>
                        <p className="text-xs text-zinc-400 mt-1">Hãy khám phá bộ sưu tập đầm dạ hội kiêu sa của chúng tôi.</p>
                     </div>
                  ) : (
                     <div className="space-y-6">
                        {orders.map(order => {
                           const startDateFormatted = order.startDate ? new Date(order.startDate).toLocaleDateString('vi-VN') : '';
                           const endDateFormatted = order.endDate ? new Date(order.endDate).toLocaleDateString('vi-VN') : '';
                           
                           return (
                              <div key={order.id} className="border border-rose-100/50 rounded-2xl p-4 md:p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                 
                                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-rose-50">
                                    <div>
                                       <span className="text-[10px] text-zinc-400 font-bold block font-mono">Mã hợp đồng: #{order.id}</span>
                                       <span className="text-xs text-zinc-400 mt-0.5 block font-mono">Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex gap-2 items-center flex-wrap">
                                       <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${getStatusStyle(order.status)}`}>
                                          {getStatusText(order.status)}
                                       </span>
                                    </div>
                                 </div>

                                 {/* Item elements */}
                                 <div className="py-4 space-y-4">
                                    {order.items.map((item, idx) => {
                                       const prod = productsMap[item.productId];
                                       return (
                                          <div key={idx} className="flex gap-4 items-center">
                                             <img 
                                                src={prod?.image || 'https://images.unsplash.com/photo-1572804013309-84a8f14457ab?auto=format&fit=crop&w=150&q=80'} 
                                                alt="" 
                                                className="w-16 h-16 rounded-xl object-cover border border-rose-50" 
                                             />
                                             <div className="flex-1">
                                                <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wide">{prod?.name[lang] || 'Thiết kế cao cấp SIHA'}</h4>
                                                <div className="text-[11px] text-zinc-400 mt-1 flex gap-4">
                                                   <span>Số lượng: {item.quantity}</span>
                                                   <span>Giá niêm yết: ${item.price} / ngày</span>
                                                </div>
                                             </div>
                                             <div className="text-right">
                                                <span className="font-bold text-zinc-800 text-sm">${item.price * item.quantity}</span>
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>

                                 {/* Rental duration and actions */}
                                 <div className="pt-4 border-t border-rose-50/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="text-xs text-zinc-500 font-medium">
                                       {startDateFormatted && endDateFormatted ? (
                                          <span className="bg-rose-50/50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-100 flex items-center gap-1.5 max-w-max">
                                             <Calendar size={13}/> Thuê từ: <b className="font-semibold">{startDateFormatted}</b> đến <b className="font-semibold">{endDateFormatted}</b>
                                          </span>
                                       ) : (
                                          <span className="text-zinc-400">Thời gian nhận trả đồ bổ sung sau</span>
                                       )}
                                    </div>
                                    <div className="flex gap-3 justify-end w-full md:w-auto items-center flex-wrap">
                                       <span className="text-xs text-zinc-400 mr-2">Tổng hoá đơn: <b className="text-rose-600 text-base font-extrabold font-mono ml-1">${order.total}</b></span>
                                       
                                       {order.status !== 'cancelled' && (
                                         <button 
                                            onClick={() => {
                                               setTrackingOrder(order);
                                               initializeLiveLogs(order);
                                            }}
                                            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-95 relative"
                                         >
                                            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping absolute -top-0.5 -right-0.5"></span>
                                            <Sparkles size={11} className="animate-spin" style={{ animationDuration: '3s' }}/>
                                            Theo Dõi Trực Tiếp
                                         </button>
                                       )}

                                       <button 
                                          onClick={() => setSelectedInvoice(order)}
                                          className="px-4 py-2 bg-zinc-900 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 shadow-sm"
                                       >
                                          Xem Hóa Đơn
                                       </button>
                                    </div>
                                 </div>

                              </div>
                           );
                        })}
                     </div>
                  )}

               </div>
            )}

            {activeTab === 'settings' && (
               <div className="bg-white rounded-3xl border border-rose-100/50 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom">
                  <div className="flex justify-between items-center pb-5 border-b border-rose-50 mb-6">
                     <div>
                        <h2 className="text-xl font-serif font-black uppercase text-zinc-800 tracking-wide">Cài đặt ứng dụng riêng</h2>
                        <p className="text-xs text-zinc-400 mt-1">Cấu hình các tiện ích nâng cao hỗ trợ trải nghiệm duyệt web tốt nhất.</p>
                     </div>
                     <span className="p-2 bg-rose-50/60 rounded-xl text-rose-400"><Settings size={20}/></span>
                  </div>

                  <div className="space-y-6">
                     
                     {/* Theme Settings */}
                     <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Tông màu giao diện ưu chuộng</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {[
                             { id: 'rose', label: 'Classic Rose (Hồng Thạch)', class: 'bg-rose-400' },
                             { id: 'emerald', label: 'Emerald (Lục Bảo Nhã)', class: 'bg-emerald-600' },
                             { id: 'navy', label: 'Royal Navy (Xanh Hoàng Gia)', class: 'bg-indigo-600' },
                             { id: 'gold', label: 'Golden Muse (Kim Hoàng)', class: 'bg-amber-500' }
                           ].map(color => (
                              <button
                                 key={color.id}
                                 onClick={() => setThemeColor(color.id)}
                                 className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-24 ${themeColor === color.id ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 bg-white hover:border-zinc-300'}`}
                              >
                                 <span className={`w-6 h-6 rounded-lg ${color.class} block`}></span>
                                 <span className="text-[10px] font-bold text-zinc-800 tracking-wide mt-2 block">{color.label}</span>
                                 {themeColor === color.id && (
                                    <span className="absolute top-2 right-2 text-white bg-zinc-900 rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold">✓</span>
                                 )}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Preferences */}
                     <div className="pt-6 border-t border-rose-50">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Nhận thông báo tự động</h3>
                        <div className="space-y-3.5">
                           
                           <label className="flex items-center gap-3.5 p-4 bg-zinc-50/40 rounded-2xl border border-rose-50/30 cursor-pointer hover:bg-zinc-50 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={receiveNotifications} 
                                onChange={e => {
                                   setReceiveNotifications(e.target.checked);
                                   updateProfile({ receiveNotifications: e.target.checked });
                                }}
                                className="w-4 h-4 rounded text-rose-500 accent-rose-500 focus:ring-rose-400" 
                              />
                              <div>
                                 <span className="text-xs font-bold text-zinc-700 block">Thông báo nhắc lịch trả váy dạ hội</span>
                                 <span className="text-[10px] text-zinc-400 block mt-0.5">Nhắc nhở nàng lịch trình nhận thêu đồ trước 1 ngày để đảm bảo chuẩn bị chu đáo nhất.</span>
                              </div>
                           </label>

                           <label className="flex items-center gap-3.5 p-4 bg-zinc-50/40 rounded-2xl border border-rose-50/30 cursor-pointer hover:bg-zinc-50 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={receiveEmails} 
                                onChange={e => {
                                   setReceiveEmails(e.target.checked);
                                   updateProfile({ receiveEmails: e.target.checked });
                                }}
                                className="w-4 h-4 rounded text-rose-500 accent-rose-500 focus:ring-rose-400" 
                              />
                              <div>
                                 <span className="text-xs font-bold text-zinc-700 block">Email cập nhật bộ sưu tập mới</span>
                                 <span className="text-[10px] text-zinc-400 block mt-0.5">Gửi các thiết kế mới nhất của Woaa Stu, Cinderella, Paris Chic tới hòm thư của nàng hàng tuần.</span>
                              </div>
                           </label>

                        </div>
                     </div>

                     {/* Displays currency conversion preference */}
                     <div className="pt-6 border-t border-rose-50">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Hiển thị đơn vị tiền tệ</h3>
                        <div className="flex gap-3">
                           {[
                             { id: 'VND', label: 'Việt Nam Đồng (VNĐ)' },
                             { id: 'USD', label: 'Đô la Mỹ ($)' }
                           ].map(curr => (
                              <button
                                 key={curr.id}
                                 onClick={() => {
                                    setCurrency(curr.id as 'USD' | 'VND');
                                    updateProfile({ currency: curr.id as 'USD' | 'VND' });
                                 }}
                                 className={`px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${currency === curr.id ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}
                              >
                                 {curr.label}
                              </button>
                           ))}
                        </div>
                     </div>

                  </div>
               </div>
            )}

         </div>
      </div>

      {/* Invoice Details Dialog (PopupModal) */}
      {selectedInvoice && (
         <div className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl relative border border-rose-100 flex flex-col animate-in slide-in-from-bottom scale-95 duration-300 max-h-[90vh]">
               
               {/* Head print */}
               <div className="bg-zinc-900 p-6 text-white text-center relative">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-rose-400">SIHA Boutique Co.</span>
                  <h3 className="text-lg font-serif tracking-[0.14em] uppercase font-bold text-white mt-1">Đơn Thuê Bản Gốc</h3>
                  <p className="text-[10px] text-zinc-400 mt-2">Điện thoại: 0909 123 456 | Email: contact@siha.vn</p>
                  <button 
                     onClick={() => setSelectedInvoice(null)} 
                     className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors"
                  >
                     ✕
                  </button>
               </div>

               {/* Invoice Info */}
               <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-zinc-700 text-sm">
                  
                  <div className="flex justify-between items-center text-xs pb-4 border-b border-zinc-100">
                     <div>
                        <p className="font-semibold">Mã ĐH: #{selectedInvoice.id}</p>
                        <p className="text-zinc-400 mt-1">Thời gian lập: {new Date(selectedInvoice.createdAt).toLocaleString('vi-VN')}</p>
                     </div>
                     <div className="text-right">
                        <p className="font-semibold text-rose-500">Đặt cọc: ĐÃ XÁC NHẬN</p>
                        <p className="text-zinc-400 mt-1 uppercase">TIỀN MẶT / CHUYỂN KHOẢN</p>
                     </div>
                  </div>

                  {/* Customer measurements fit card within invoice */}
                  <div className="bg-rose-50/30 border border-rose-100/40 p-4 rounded-xl text-xs space-y-1">
                     <p className="font-bold uppercase text-rose-600 tracking-wider mb-2 flex items-center gap-1.5"><Ruler size={12}/> Kiểm soát số đo cho thuê</p>
                     <p className="text-zinc-600">Khách hàng: <b className="font-bold text-zinc-800">{name}</b></p>
                     <p className="text-zinc-500">Số đo tham chiếu: <span className="font-semibold text-zinc-700">{height}cm | {weight}kg</span></p>
                     <p className="text-zinc-500">Size váy đặt trước: <span className="font-bold text-rose-600">{dressSize}</span> | Size cao gót: <span className="font-bold text-rose-600">{shoeSize}</span></p>
                     <p className="text-zinc-500">Địa chỉ: {address || selectedInvoice.shippingAddress}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-4">
                     <p className="text-zinc-400 uppercase tracking-wider text-[10px] font-black">Danh sách đầm dạ hội & phụ kiện</p>
                     {selectedInvoice.items.map((item, id) => {
                        const prod = productsMap[item.productId];
                        return (
                           <div key={id} className="flex justify-between items-center bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-xs">
                              <div>
                                 <p className="font-bold text-zinc-800 uppercase">{prod?.name[lang] || 'Sản phẩm cho thuê cao cấp'}</p>
                                 <p className="text-zinc-400 mt-0.5">Số lượng: {item.quantity} chiếc x {item.price} / ngày</p>
                              </div>
                              <p className="font-bold text-zinc-900">${item.price * item.quantity}</p>
                           </div>
                        );
                     })}
                  </div>

                  {/* Rental Timeline */}
                  {selectedInvoice.startDate && selectedInvoice.endDate && (
                     <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg text-xs space-y-1">
                        <p className="text-zinc-400 uppercase tracking-widest text-[9px] font-bold">Lược đồ thời gian thêu đồ</p>
                        <p className="font-semibold text-zinc-700 flex items-center gap-1.5 mt-1">
                           <Calendar size={12} className="text-rose-400"/> Nhận đồ: {new Date(selectedInvoice.startDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="font-semibold text-zinc-700 flex items-center gap-1.5">
                           <Calendar size={12} className="text-zinc-400"/> Trả hồ sơ: {new Date(selectedInvoice.endDate).toLocaleDateString('vi-VN')}
                        </p>
                     </div>
                  )}

                  {/* Calculation invoice */}
                  <div className="pt-4 border-t border-zinc-100 text-xs space-y-1.5">
                     <div className="flex justify-between text-zinc-500">
                        <span>Giá thuê trung bình:</span>
                        <span>${selectedInvoice.total}</span>
                     </div>
                     <div className="flex justify-between text-zinc-500">
                        <span>Thuế tiêu thụ (VAT):</span>
                        <span>0.00 % (Miễn phí)</span>
                     </div>
                     <div className="flex justify-between text-zinc-500">
                        <span>Phí vệ sinh & là nếp váy:</span>
                        <span>Bao gồm</span>
                     </div>
                     <div className="flex justify-between text-zinc-900 font-extrabold border-t border-dashed border-zinc-200 pt-3 text-sm">
                        <span>Tổng chi phí đặt chỗ:</span>
                        <span className="text-base text-rose-600 font-mono">${selectedInvoice.total}</span>
                     </div>
                  </div>

               </div>

               {/* Print buttons */}
               <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex gap-2">
                  <button 
                     onClick={() => window.print()}
                     className="flex-1 py-3.5 bg-zinc-900 hover:bg-rose-600 active:scale-95 text-white text-[11px] font-bold tracking-widest uppercase rounded-xl transition-all"
                  >
                     In Hoá Đơn
                  </button>
                  <button 
                     onClick={() => setSelectedInvoice(null)}
                     className="flex-1 py-3.5 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-bold tracking-widest uppercase rounded-xl transition-all"
                  >
                     Quay Lại
                  </button>
               </div>

            </div>
         </div>
      )}

      {/* Real-time Order Tracking Modal */}
      {trackingOrder && (
         <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-zinc-900 text-white max-w-2xl w-full rounded-w-3xl rounded-3xl overflow-hidden shadow-2xl relative border border-rose-500/20 flex flex-col animate-in slide-in-from-bottom scale-95 duration-300 max-h-[95vh]">
               
               {/* Modal Header */}
               <div className="p-6 border-b border-zinc-800 flex justify-between items-center relative overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-950">
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-transparent border border-rose-500/10 rounded-full"></div>
                  <div>
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 animate-pulse">
                           ● LIVE TRACKING
                        </span>
                        {simulationActive && (
                           <span className="text-[9px] font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              MÔ PHỎNG HOẠT ĐỘNG
                           </span>
                        )}
                     </div>
                     <h3 className="text-xl font-serif tracking-[0.1em] uppercase font-black text-white mt-1.5">
                        Hành Trình Tỏa Sáng #{trackingOrder.id.substring(0, 8)}
                     </h3>
                  </div>
                  <button 
                     onClick={() => setTrackingOrder(null)} 
                     className="bg-zinc-800 hover:bg-zinc-700 hover:text-rose-400 text-zinc-400 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all border border-zinc-700/50"
                  >
                     ✕
                  </button>
               </div>

               {/* Modal Body */}
               <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                  
                  {/* Progress Gauge */}
                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-inner relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl"></div>
                     <div className="flex justify-between items-center mb-2.5 text-xs">
                        <span className="text-zinc-400 font-medium">Tiến trình chuẩn bị tự động:</span>
                        <span className="text-rose-400 font-bold font-mono text-xs tracking-widest bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/10">{logsProgress}% HOÀN TẤT</span>
                     </div>
                     <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden border border-zinc-700/80">
                        <div 
                           className="bg-gradient-to-r from-rose-500 via-pink-600 to-teal-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
                           style={{ width: `${logsProgress}%` }}
                        ></div>
                     </div>
                     
                     <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        <span className={logsProgress >= 15 ? "text-rose-400" : ""}>Tiếp nhận</span>
                        <span className={logsProgress >= 45 ? "text-rose-400" : ""}>Kim Chỉ</span>
                        <span className={logsProgress >= 65 ? "text-rose-400" : ""}>Hấp Sấy</span>
                        <span className={logsProgress >= 78 ? "text-rose-400" : ""}>Logistics</span>
                        <span className={logsProgress >= 100 ? "text-teal-400 animate-pulse" : ""}>Sẵn Sàng</span>
                     </div>
                  </div>

                  {/* Operational Status Nodes */}
                  <div className="space-y-4">
                     <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-black">Các mốc thời gian thiết kế chính</p>
                     
                     <div className="relative pl-7 border-l border-dashed border-zinc-800 space-y-5 ml-3">
                        
                        {/* Node 1: Created */}
                        <div className="relative">
                           <span className={`absolute -left-[37px] top-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${logsProgress >= 15 ? 'bg-rose-500 border-rose-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                              1
                           </span>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
                                 Boutique Tiếp Nhận Đơn Đặt
                                 {logsProgress >= 15 && <span className="text-[8px] tracking-widest uppercase font-bold py-0.5 px-2 bg-rose-500/10 text-rose-400 rounded border border-rose-500/10">ĐỒNG Ý</span>}
                              </p>
                              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                 Bộ phận ký duyệt đơn đặt thuê túc trực xác minh, đăng ký bảo hiểm chống làm mờ dập hạt cườm lấp lánh mẫu váy.
                              </p>
                           </div>
                        </div>

                        {/* Node 2: Needle Adjustments */}
                        <div className="relative">
                           <span className={`absolute -left-[37px] top-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${logsProgress >= 45 ? 'bg-rose-500 border-rose-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                              2
                           </span>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
                                 Tinh Thiết Trình Form Dáng Nàng
                                 {logsProgress >= 45 && <span className="text-[8px] tracking-widest uppercase font-bold py-0.5 px-2 bg-rose-500/10 text-rose-400 rounded border border-rose-500/10">ĐÃ XỬ LÝ</span>}
                              </p>
                              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                 Áp nẹp gông nâng ngực bó nhung theo số đo vóc dáng thực {height}cm | {weight}kg của nàng, nới lỏng phồng vạt thêu để dáng lộng lẫy ưu nhã nhất.
                              </p>
                           </div>
                        </div>

                        {/* Node 3: Heated Steam */}
                        <div className="relative">
                           <span className={`absolute -left-[37px] top-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${logsProgress >= 65 ? 'bg-rose-500 border-rose-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                              3
                           </span>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
                                 Ủi Nếp Hơi Nước & Xông Khử Khuẩn 5 Sao
                                 {logsProgress >= 65 && <span className="text-[8px] tracking-widest uppercase font-bold py-0.5 px-2 bg-rose-500/10 text-rose-400 rounded border border-rose-500/10">AN TOÀN</span>}
                              </p>
                              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                 Sấy hơi nước ủ tinh dầu nhài nhiệt độ âm chống xù vải, làm bung rạng rỡ từng tà lụa thanh tao quyến rũ.
                              </p>
                           </div>
                        </div>

                        {/* Node 4: Shipped */}
                        <div className="relative">
                           <span className={`absolute -left-[37px] top-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${logsProgress >= 78 ? 'bg-rose-500 border-rose-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                              4
                           </span>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
                                 Gói Thắt Gấm Đóng Thùng Hỏa Tốc
                                 {logsProgress >= 78 && <span className="text-[8px] tracking-widest uppercase font-bold py-0.5 px-2 bg-rose-500/10 text-rose-400 rounded border border-rose-500/10">BÀN GIAO</span>}
                              </p>
                              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                 Đóng lót hộp giấy lụa cứng bảo bọc form váy, kết nối bưu cục vận chuyển hỏa tốc Ahamove giao hàng trực tiếp tận cửa.
                              </p>
                           </div>
                        </div>

                        {/* Node 5: Sẵn sàng diện */}
                        <div className="relative">
                           <span className={`absolute -left-[37px] top-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${logsProgress >= 100 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                              ✓
                           </span>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
                                 Nàng Nhận Đầm & Tỏa Sáng Dạ Tiệc
                                 {logsProgress >= 100 && <span className="text-[8px] tracking-widest uppercase font-bold py-0.5 px-2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 animate-pulse">SẴN SÀNG DIỆN</span>}
                              </p>
                              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                 Đầm váy SIHA đã bàn giao thành công mỹ mãn. Chúc nàng diện gấm hoa khôi kiều diễm tuyệt trần thu hút mọi ánh nhìn hôm nay!
                              </p>
                           </div>
                        </div>

                     </div>
                  </div>

                  {/* Real-time Logistics Terminal Output */}
                  <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-black flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                           Báo cáo luồng tác vụ SIHA (Thời gian thực)
                        </p>
                        <label className="text-[8px] tracking-widest text-zinc-400 uppercase font-bold flex items-center gap-2 cursor-pointer bg-zinc-800 px-3 py-1.5 rounded border border-zinc-700/50 hover:text-white transition-all">
                           <input 
                              type="checkbox" 
                              checked={simulationActive} 
                              onChange={(e) => setSimulationActive(e.target.checked)}
                              className="accent-rose-500 rounded"
                           />
                           Chạy mô phỏng trực tiếp
                        </label>
                     </div>

                     <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 font-mono h-40 overflow-y-auto space-y-2.5 shadow-inner">
                        {liveLogs.map((log, index) => (
                           <div key={index} className="text-[11px] flex gap-2 leading-relaxed tracking-wide animate-in fade-in slide-in-from-top-1">
                              <span className="text-rose-400 font-bold whitespace-nowrap">[{log.time}]</span>
                              <span className="text-zinc-600 shrink-0 select-none">|</span>
                              <span className="text-zinc-500 shrink-0 text-[9px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded leading-none flex items-center justify-center uppercase">{log.category}</span>
                              <span className="text-zinc-300 font-sans">{log.text}</span>
                           </div>
                        ))}
                     </div>
                     <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
                        Hệ thống điều vận tự động hóa SIHA áp dụng cảm biến thông tin RFID tiên tiến trên từng mẫu thiết kế dạ hội.
                     </p>
                  </div>

               </div>

               {/* Close footer button */}
               <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-2">
                  <button 
                     onClick={() => setTrackingOrder(null)}
                     className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 font-bold text-[11px] uppercase tracking-widest text-center rounded-xl transition-all shadow-md shadow-rose-500/10 hover:shadow-rose-500/20"
                  >
                     Ẩn Tiến Trình Giám Sát
                  </button>
               </div>

            </div>
         </div>
      )}

    </div>
  );
};

export default ProfilePage;