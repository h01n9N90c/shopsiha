import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { Product, Order, User, Category, OrderStatus, UserRole } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Activity, Users, DollarSign, Package, AlertCircle, Trash2, Edit, Plus, 
  CheckCircle, X, Calendar, Sparkles, Filter, Search, RefreshCw, Layers, Eye, ShieldCheck, ShoppingCart,
  Printer, Award, TrendingUp, BookOpen, ArrowUpDown, Download, Check
} from 'lucide-react';

const REVENUE_DATA = [
  { name: 'T2', uv: 1400, pv: 2400 },
  { name: 'T3', uv: 2300, pv: 1398 },
  { name: 'T4', uv: 4800, pv: 9800 },
  { name: 'T5', uv: 5900, pv: 3908 },
  { name: 'T6', uv: 8900, pv: 4800 },
  { name: 'T7', uv: 12400, pv: 3800 },
  { name: 'CN', uv: 15400, pv: 4300 },
];

export const AdminDashboard: React.FC = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { authService, productService, orderService } = useServices();

  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'products' | 'categories' | 'users' | 'orders'>('analytics');
  
  // Data loading triggers
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [triggerRefresh, setTriggerRefresh] = useState(0);

  // Search/Filters & Advanced Sorting
  const [productSearch, setProductSearch] = useState('');
  const [productSort, setProductSort] = useState<'id' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'sold-desc'>('id');
  const [userSearch, setUserSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSort, setOrderSort] = useState<'date-desc' | 'date-asc' | 'total-desc' | 'total-asc'>('date-desc');

  // Addition form modal states (for adding items)
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Products
  const [pId, setPId] = useState('');
  const [pNameVi, setPNameVi] = useState('');
  const [pNameEn, setPNameEn] = useState('');
  const [pPrice, setPPrice] = useState(150);
  const [pOriginalPrice, setPOriginalPrice] = useState(250);
  const [pStock, setPStock] = useState(5);
  const [pImage, setPImage] = useState('');
  const [pCategoryId, setPCategoryId] = useState('va-1');
  const [pIsFlashSale, setPIsFlashSale] = useState(false);

  // Form states for Categories Management
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catNameVi, setCatNameVi] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catIcon, setCatIcon] = useState('Sparkles');

  // Dedicated Detail Modals
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Custom interactive dropdown menu states
  const [activeStatusDropdownId, setActiveStatusDropdownId] = useState<string | null>(null);
  const [isProductSortOpen, setIsProductSortOpen] = useState(false);
  const [isOrderSortOpen, setIsOrderSortOpen] = useState(false);

  // Load backend statistics
  useEffect(() => {
    productService.getAllProducts().then(pData => setProducts(pData));
    productService.getCategories().then(cData => {
      setCategories(cData);
      if (cData.length > 0) setPCategoryId(cData[0].id);
    });
    orderService.getAllOrders().then(oData => setAllOrders(oData));
    setAllUsers(authService.getAllUsers());
  }, [triggerRefresh, productService, orderService, authService]);

  useEffect(() => {
    const handleUpdate = () => {
      setTriggerRefresh(prev => prev + 1);
    };
    window.addEventListener('siha_orders_updated', handleUpdate);
    return () => {
      window.removeEventListener('siha_orders_updated', handleUpdate);
    };
  }, []);

  const refreshData = () => {
    setTriggerRefresh(prev => prev + 1);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-red-100 shadow-xl text-center">
         <AlertCircle size={48} className="text-red-500 mx-auto fill-red-50 mb-4"/>
         <h2 className="text-2xl font-serif font-black uppercase text-zinc-800 mb-2">Từ chối truy cập</h2>
         <p className="text-zinc-500 text-xs leading-relaxed mb-6">Tài khoản của nàng không phải là Quản Trị Viên (Admin) của hệ thống SIHA Boutique. Vui lòng thử đăng nhập tài khoản "admin@s.com".</p>
         <a href="/login" className="inline-block px-8 py-3.5 bg-zinc-900 hover:bg-rose-600 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all">Quay Lại Đăng Nhập</a>
      </div>
    );
  }

  // Calculate live statistics
  const totalRevenue = allOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const calculateDays = (startStr?: string, endStr?: string) => {
    if (!startStr || !endStr) return 1;
    const s = new Date(startStr);
    const e = new Date(endStr);
    const diff = Math.abs(e.getTime() - s.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 1 : days;
  };

  // Submit product creation/editing
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNameVi.trim() || !pNameEn.trim()) return;

    const finalProduct: Product = {
      id: editingProduct ? editingProduct.id : `PRD-${Date.now().toString().slice(-4)}`,
      name: { vi: pNameVi.trim(), en: pNameEn.trim() },
      price: Number(pPrice),
      originalPrice: Number(pOriginalPrice),
      stock: Number(pStock),
      image: pImage || 'https://images.unsplash.com/photo-1572804013309-84a8f14457ab?auto=format&fit=crop&w=400&q=80',
      categoryId: pCategoryId,
      rating: editingProduct ? editingProduct.rating : 5.0,
      soldCount: editingProduct ? editingProduct.soldCount : 0,
      isFlashSale: pIsFlashSale
    };

    if (editingProduct) {
      await productService.updateProduct(finalProduct);
    } else {
      await productService.addProduct(finalProduct);
    }

    // Reset fields
    setPNameVi('');
    setPNameEn('');
    setPPrice(150);
    setPOriginalPrice(250);
    setPStock(5);
    setPImage('');
    setPIsFlashSale(false);
    setEditingProduct(null);
    setShowAddForm(false);
    refreshData();
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPNameVi(prod.name.vi);
    setPNameEn(prod.name.en);
    setPPrice(prod.price);
    setPOriginalPrice(prod.originalPrice || prod.price);
    setPStock(prod.stock);
    setPImage(prod.image);
    setPCategoryId(prod.categoryId);
    setPIsFlashSale(!!prod.isFlashSale);
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Nàng có chắc chắn muốn xóa thiết kế thời trang này khỏi tủ đồ của cửa hàng?')) {
      await productService.deleteProduct(id);
      refreshData();
    }
  };

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => {
      setAdminToast(null);
    }, 3000);
  };

  const handleQuickStockChange = async (prodId: string, amount: number) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;
    const updated = { ...prod, stock: Math.max(0, prod.stock + amount) };
    await productService.updateProduct(updated);
    showToast(`Đã cập nhật tồn kho cho ${prod.name[lang]}`);
    refreshData();
  };

  const handleQuickFlashToggle = async (prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;
    const updated = { ...prod, isFlashSale: !prod.isFlashSale };
    await productService.updateProduct(updated);
    showToast(updated.isFlashSale ? 'Đã bật chế độ Flash Sale đề xuất!' : 'Đã tắt chế độ Flash Sale!');
    refreshData();
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameVi.trim() || !catNameEn.trim()) return;
    
    const currentCatsStr = localStorage.getItem('siha_categories') || '[]';
    let currentCats: Category[] = JSON.parse(currentCatsStr);

    if (editingCategory) {
      currentCats = currentCats.map(c => c.id === editingCategory.id ? {
        id: c.id,
        name: { vi: catNameVi.trim(), en: catNameEn.trim() },
        icon: catIcon
      } : c);
      showToast('Đã cập nhật danh mục thành công!');
    } else {
      const newCat: Category = {
        id: `cat-${Date.now().toString().slice(-4)}`,
        name: { vi: catNameVi.trim(), en: catNameEn.trim() },
        icon: catIcon
      };
      currentCats.push(newCat);
      showToast('Đã thêm danh mục mới!');
    }

    localStorage.setItem('siha_categories', JSON.stringify(currentCats));
    setCatNameVi('');
    setCatNameEn('');
    setCatIcon('Sparkles');
    setEditingCategory(null);
    setShowAddCategoryForm(false);
    refreshData();
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatNameVi(cat.name.vi);
    setCatNameEn(cat.name.en);
    setCatIcon(cat.icon || 'Sparkles');
    setShowAddCategoryForm(true);
  };

  const handleDeleteCategory = (catId: string) => {
    const productsInCat = products.filter(p => p.categoryId === catId);
    if (productsInCat.length > 0) {
      alert(`Không thể xóa danh mục này vì đang chứa ${productsInCat.length} thiết kế thời trang. Nàng vui lòng di chuyển sản phẩm sang danh mục khác trước!`);
      return;
    }
    if (confirm('Nàng có chắc chắn muốn xóa danh mục này tuyển chọn khỏi cửa hàng?')) {
      const currentCatsStr = localStorage.getItem('siha_categories') || '[]';
      let currentCats: Category[] = JSON.parse(currentCatsStr);
      currentCats = currentCats.filter(c => c.id !== catId);
      localStorage.setItem('siha_categories', JSON.stringify(currentCats));
      showToast('Đã xóa danh mục thời trang thành công!');
      refreshData();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, status);
    // Sync active detail order if open
    if (selectedOrderForDetail && selectedOrderForDetail.id === orderId) {
      setSelectedOrderForDetail(prev => prev ? { ...prev, status } : null);
    }
    showToast(`Đã cập nhật trạng thái đơn #${orderId} thành công!`);
    refreshData();
  };

  const handleToggleUserRole = (targetUser: User) => {
    const newRole: UserRole = targetUser.role === 'admin' ? 'user' : 'admin';
    authService.updateUserRole(targetUser.id, newRole);
    refreshData();
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Xác nhận xóa tài khoản khách hàng này khỏi hệ thống cơ sở?')) {
      authService.deleteUser(userId);
      refreshData();
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Super luxury header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
        <div>
          <span className="text-[10px] text-rose-500 font-extrabold uppercase tracking-[0.25em] font-mono flex items-center gap-1.5"><ShieldCheck size={12}/> HỆ THỐNG QUẢN TRỊ SIHA</span>
          <h1 className="text-3xl font-serif font-black uppercase tracking-tight text-zinc-950 mt-1">SIHA Central Panel</h1>
          <p className="text-zinc-500 text-xs mt-1">Quản lý đặt cọc cho thuê đầm, kiểm tra danh bạ khách hàng cao cấp và điều tiết kho thời trang.</p>
        </div>

        <div className="flex gap-2 shrink-0">
           <button 
              onClick={refreshData}
              className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200/50 text-zinc-500 transition-colors flex items-center justify-center"
              title="Lưu lại và Tải lại biến động"
           >
              <RefreshCw size={16}/>
           </button>
           <button 
              onClick={() => {
                 setEditingProduct(null);
                 setPNameVi('');
                 setPNameEn('');
                 setPPrice(150);
                 setPOriginalPrice(250);
                 setPStock(5);
                 setPImage('');
                 setPIsFlashSale(false);
                 setShowAddForm(true);
              }}
              className="px-5 py-3 bg-zinc-900 hover:bg-rose-600 active:scale-95 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-md shadow-zinc-950/10"
           >
              <Plus size={15}/> Thêm Thiết Kế
           </button>
        </div>
      </div>

      {/* KPI live metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">{t('revenue')} (Thực đặt)</div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={18}/></div>
          </div>
          <div className="text-2xl font-bold text-zinc-950 font-mono">${totalRevenue}</div>
          <p className="text-[10px] text-emerald-600 mt-2 font-semibold">Tích lũy từ {allOrders.length} hóa đơn</p>
        </div>

        {/* Total Active Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Tổng Đơn Đặt Thuê</div>
             <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ShoppingCart size={18}/></div>
          </div>
          <div className="text-2xl font-bold text-zinc-950 font-mono">{allOrders.length} đơn</div>
          <p className="text-[10px] text-rose-500 mt-2 font-semibold">
             {allOrders.filter(o => o.status === 'pending').length} đơn đang chờ duyệt
          </p>
        </div>

        {/* Total fashion design products in shop catalog */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Hàng Dạ Hội Trong Kho</div>
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Package size={18}/></div>
          </div>
          <div className="text-2xl font-bold text-zinc-950 font-mono">{products.length} mẫu</div>
          <p className="text-[10px] text-blue-500 mt-2 font-semibold">Sẵn sàng điều phối thêu choàng</p>
        </div>

        {/* Customers registered */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Quy Mô Khách Hàng</div>
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={18}/></div>
          </div>
          <div className="text-2xl font-bold text-zinc-950 font-mono">{allUsers.length} tài khoản</div>
          <p className="text-[10px] text-purple-500 mt-2 font-semibold">+1 tài khoản vừa đăng ký hôm nay</p>
        </div>

      </div>

      {/* Sub Tabs controller */}
      <div className="flex border-b border-zinc-200 gap-1 overflow-x-auto pb-px">
         {[
           { id: 'analytics', label: 'Biểu đồ & Phân tích', icon: <Activity size={15}/> },
           { id: 'products', label: 'Quản lý kho thời trang', icon: <Package size={15}/> },
           { id: 'categories', label: 'Quản lý bộ danh mục', icon: <Layers size={15}/> },
           { id: 'users', label: 'Danh bạ Khách hàng', icon: <Users size={15}/> },
           { id: 'orders', label: 'QL Hợp đồng / Booking', icon: <ShoppingCart size={15}/> }
         ].map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveSubTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-4 border-b-2 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'border-zinc-900 text-zinc-900 font-extrabold' : 'border-transparent text-zinc-400 hover:text-zinc-700'}`}
            >
               {tab.icon} {tab.label}
            </button>
         ))}
      </div>

      {/* Analytics view content */}
      {activeSubTab === 'analytics' && (
         <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* Revenue growth */}
               <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                 <h3 className="font-serif font-extrabold uppercase text-sm tracking-widest text-zinc-800 mb-6">Biến động dòng tiền cho thuê dạ hội</h3>
                 <div className="h-72">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={REVENUE_DATA}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} dx={-10} />
                       <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}/>
                       <Line type="monotone" dataKey="uv" stroke="#ec4899" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               {/* Visit / Product interest breakdown */}
               <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                  <h3 className="font-serif font-extrabold uppercase text-sm tracking-widest text-zinc-800 mb-6">Tương tác và Tỉ lệ giữ váy (Theo ngày)</h3>
                  <div className="h-72">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={REVENUE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} dx={-10} />
                        <RechartsTooltip cursor={{fill: '#fafafa'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}/>
                        <Bar dataKey="pv" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>

            </div>

            {/* Quick overview metrics box */}
            <div className="bg-zinc-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl"></div>
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/10">
                  <div className="pt-4 md:pt-0">
                     <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Doanh số bình quân / đơn</span>
                     <span className="text-3xl font-bold block mt-2 font-mono">${((allOrders.length ? totalRevenue / allOrders.length : 0)).toFixed(1)}</span>
                     <span className="text-xs text-rose-400 mt-1 block">Tỷ suất sinh lời kép</span>
                  </div>
                  <div className="pt-4 md:pt-0 md:pl-8">
                     <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Sức khỏe lấp hàng dự phòng</span>
                     <span className="text-3xl font-bold block mt-2 font-mono">92 %</span>
                     <span className="text-xs text-rose-400 mt-1 block">Tốc độ lưu thông váy nhanh</span>
                  </div>
                  <div className="pt-4 md:pt-0 md:pl-8">
                     <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Mức độ Hài Lòng Khách hàng</span>
                     <span className="text-3xl font-bold block mt-2 font-mono">4.9 / 5</span>
                     <span className="text-xs text-emerald-400 mt-1 block">Đóng góp từ 1,200 đánh giá cao</span>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Catalog / Products management crud */}
      {activeSubTab === 'products' && (
         <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h3 className="font-serif font-black uppercase tracking-wide text-zinc-800 text-lg">Hàng may mặc & Thời trang lưu kho</h3>
                  <p className="text-zinc-500 text-xs mt-1">Nàng có thể kiểm soát chi phí đặt chỗ, điều chỉnh số lượng tồn, lọc thông minh và cập nhật Flash Sale.</p>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  {/* Sorting dropdown */}
                  <div className="relative shrink-0 font-sans">
                     <button
                        type="button"
                        onClick={() => setIsProductSortOpen(!isProductSortOpen)}
                        className="text-xs pl-4 pr-10 py-2.5 bg-zinc-50 border border-zinc-150 rounded-xl outline-none focus:border-rose-400 font-bold text-zinc-650 transition-all hover:bg-zinc-100/60 cursor-pointer flex items-center justify-between min-w-[200px]"
                     >
                        <span>
                           {productSort === 'id' && 'Sắp xếp: Mặc định'}
                           {productSort === 'price-asc' && 'Giá thuê: Thấp → Cao'}
                           {productSort === 'price-desc' && 'Giá thuê: Cao → Thấp'}
                           {productSort === 'stock-asc' && 'Số lượng tồn: Ít trước'}
                           {productSort === 'stock-desc' && 'Số lượng tồn: Nhiều trước'}
                           {productSort === 'sold-desc' && 'Chọn lọc: Thuê nhiều nhất'}
                        </span>
                     </button>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                        <ArrowUpDown size={12} />
                     </div>

                     {isProductSortOpen && (
                        <>
                           <div className="fixed inset-0 z-20" onClick={() => setIsProductSortOpen(false)} />
                           <div className="absolute right-0 mt-1 w-56 bg-white border border-zinc-100 rounded-2xl shadow-xl z-30 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 text-xs text-zinc-700">
                              {[
                                 { value: 'id', label: 'Sắp xếp: Mặc định' },
                                 { value: 'price-asc', label: 'Giá thuê: Thấp → Cao' },
                                 { value: 'price-desc', label: 'Giá thuê: Cao → Thấp' },
                                 { value: 'stock-asc', label: 'Số lượng tồn: Ít trước' },
                                 { value: 'stock-desc', label: 'Số lượng tồn: Nhiều trước' },
                                 { value: 'sold-desc', label: 'Chọn lọc: Thuê nhiều nhất' }
                              ].map((opt) => (
                                 <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                       setProductSort(opt.value as any);
                                       setIsProductSortOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-1.5 hover:bg-zinc-50 font-semibold transition-colors flex items-center justify-between ${
                                       productSort === opt.value ? 'text-rose-600 bg-rose-50/45' : 'text-zinc-650'
                                    }`}
                                 >
                                    <span>{opt.label}</span>
                                    {productSort === opt.value && <Check size={12} className="text-rose-500" />}
                                 </button>
                              ))}
                           </div>
                        </>
                     )}
                  </div>

                  {/* Search bar */}
                  <div className="relative w-full sm:w-64">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <Search size={15}/>
                     </div>
                     <input 
                       type="text" 
                       placeholder="Tìm thiết kế theo tên..."
                       value={productSearch}
                       onChange={e => setProductSearch(e.target.value)}
                       className="w-full text-xs pl-9 pr-4 py-2.5 bg-zinc-50 outline-none rounded-xl border border-zinc-100 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all font-semibold" 
                     />
                  </div>
               </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...products]
                 .filter(p => p.name.vi.toLowerCase().includes(productSearch.toLowerCase()) || p.name.en.toLowerCase().includes(productSearch.toLowerCase()))
                 .sort((a, b) => {
                    if (productSort === 'price-asc') return a.price - b.price;
                    if (productSort === 'price-desc') return b.price - a.price;
                    if (productSort === 'stock-asc') return a.stock - b.stock;
                    if (productSort === 'stock-desc') return b.stock - a.stock;
                    if (productSort === 'sold-desc') return (b.soldCount || 0) - (a.soldCount || 0);
                    return 0;
                 })
                 .map(prod => {
                    const cat = categories.find(c => c.id === prod.categoryId);
                    return (
                       <div key={prod.id} className="border border-zinc-100 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                          <div className="relative h-48 bg-zinc-100 flex items-center justify-center overflow-hidden">
                             <img 
                               src={prod.image} 
                               alt="" 
                               referrerPolicy="no-referrer"
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                             />
                             {prod.isFlashSale && (
                                <span className="absolute top-3 left-3 bg-rose-500 text-white font-bold text-[9px] uppercase px-2 py-1 rounded-full flex items-center gap-1">
                                   <Sparkles size={9}/> flash sale
                                </span>
                             )}
                             
                             {/* Recommendation / Flash toggle */}
                             <button
                                onClick={() => handleQuickFlashToggle(prod.id)}
                                className="absolute top-3 right-3 bg-white/95 text-zinc-600 hover:text-rose-500 p-1.5 rounded-full shadow-md transition-all text-xs"
                                title="Bật/Tắt đề xuất Flash Sale"
                             >
                                <Sparkles size={11} className={prod.isFlashSale ? "text-rose-500 fill-rose-500 animate-pulse" : ""} />
                             </button>

                             {/* Quick stock adjustment controls */}
                             <div className="absolute bottom-3 right-3 bg-zinc-900/90 text-white font-mono text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-zinc-750 flex items-center gap-2">
                                <span>Tồn: {prod.stock}</span>
                                <div className="flex gap-1 border-l border-zinc-700 pl-1.5">
                                   <button 
                                      onClick={() => handleQuickStockChange(prod.id, -1)}
                                      className="w-4 h-4 bg-zinc-800 hover:bg-rose-600 rounded flex items-center justify-center text-[10px] font-black transition-colors"
                                      title="Giảm 1 kho"
                                   >
                                      -
                                   </button>
                                   <button 
                                      onClick={() => handleQuickStockChange(prod.id, 1)}
                                      className="w-4 h-4 bg-zinc-800 hover:bg-emerald-600 rounded flex items-center justify-center text-[10px] font-black transition-colors"
                                      title="Tăng 1 kho"
                                   >
                                      +
                                   </button>
                                </div>
                             </div>

                             {cat && (
                                <span className="absolute bottom-3 left-3 bg-zinc-900/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white">
                                   {cat.name[lang]}
                                </span>
                             )}
                          </div>

                          <div className="p-4 space-y-3">
                             <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                                <span>ID: #{prod.id}</span>
                                <span className="bg-zinc-50 text-zinc-500 px-1.5 py-0.5 rounded text-[9px] font-medium border border-zinc-100">Đã thuê: {prod.soldCount || 0} lần</span>
                             </div>
                             <h4 className="font-bold text-zinc-800 text-[13px] uppercase tracking-wide truncate">{prod.name[lang]}</h4>
                             
                             <div className="flex justify-between items-end border-t border-zinc-100 pt-3">
                                <div>
                                   <span className="text-[9px] text-zinc-400 uppercase font-black block">Phí đặt phòng / ngày</span>
                                   <span className="font-mono text-rose-500 font-extrabold text-base">${prod.price}</span>
                                   {prod.originalPrice && <span className="text-[10px] text-zinc-400 line-through ml-1.5 font-mono">${prod.originalPrice}</span>}
                                </div>

                                <div className="flex gap-1.5">
                                   <button 
                                      onClick={() => startEditProduct(prod)}
                                      className="p-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-lg border border-zinc-200/50 transition-colors"
                                      title="Chỉnh sửa chi tiết"
                                   >
                                      <Edit size={14}/>
                                   </button>
                                   <button 
                                      onClick={() => handleDeleteProduct(prod.id)}
                                      className="p-2 bg-red-50 hover:bg-red-100 text-red-630 rounded-lg border border-red-105 transition-colors"
                                      title="Xóa thiết kế khỏi kho"
                                   >
                                      <Trash2 size={14}/>
                                   </button>
                                </div>
                             </div>
                          </div>
                       </div>
                    );
                 })}
            </div>
         </div>
      )}

      {/* Categories management tab */}
      {activeSubTab === 'categories' && (
         <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <h3 className="font-serif font-black uppercase tracking-wide text-zinc-800 text-lg">Hệ thống phân mục thời trang SIHA</h3>
                  <p className="text-zinc-500 text-xs mt-1">Nàng có thể tùy chỉnh nhóm sản phẩm, biểu tượng và theo dõi lưu lượng thời trang may mẫu đắt giá.</p>
               </div>
               <button
                  onClick={() => {
                     setEditingCategory(null);
                     setCatNameVi('');
                     setCatNameEn('');
                     setCatIcon('Sparkles');
                     setShowAddCategoryForm(!showAddCategoryForm);
                  }}
                  className="flex items-center gap-1.5 px-4  py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
               >
                  {showAddCategoryForm ? <X size={13}/> : <Plus size={13}/>}
                  {showAddCategoryForm ? 'Đóng chế độ' : 'Thêm danh mục mới'}
               </button>
            </div>

            {/* Category Form modal-like style inline */}
            {showAddCategoryForm && (
               <form onSubmit={handleCategorySubmit} className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 space-y-4 animate-in slide-in-from-top duration-300">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-700">
                     {editingCategory ? 'Biên tập danh mục tuyển chọn' : 'Khởi tạo danh mục phân phối mới'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label className="block text-[10px] text-zinc-400 uppercase font-black mb-1.5">Tên danh mục (Tiếng Việt)</label>
                        <input
                           type="text"
                           placeholder="Ví dụ: Váy Dạ Hội Cao Cấp"
                           value={catNameVi}
                           onChange={e => setCatNameVi(e.target.value)}
                           className="w-full text-xs px-3.5 py-2.5 bg-white outline-none rounded-xl border border-zinc-200 focus:border-rose-450 transition-all font-semibold"
                           required
                        />
                     </div>
                     
                     <div>
                        <label className="block text-[10px] text-zinc-400 uppercase font-black mb-1.5">Tên danh mục (English Name)</label>
                        <input
                           type="text"
                           placeholder="e.g. VIP Gala Evening Dresses"
                           value={catNameEn}
                           onChange={e => setCatNameEn(e.target.value)}
                           className="w-full text-xs px-3.5 py-2.5 bg-white outline-none rounded-xl border border-zinc-200 focus:border-rose-450 transition-all font-semibold"
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-[10px] text-zinc-400 uppercase font-black mb-1.5">Biểu tượng / Lucide icon</label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                           {[
                              { name: 'Sparkles', icon: Sparkles, label: '✨ Sparkles' },
                              { name: 'Layers', icon: Layers, label: '🥞 Layers' },
                              { name: 'Award', icon: Award, label: '🏆 Award' },
                              { name: 'Package', icon: Package, label: '📦 Package' },
                              { name: 'ShoppingCart', icon: ShoppingCart, label: '🛒 Cart' },
                              { name: 'TrendingUp', icon: TrendingUp, label: '📈 Trend' },
                              { name: 'BookOpen', icon: BookOpen, label: '📖 Lookbook' },
                           ].map(item => {
                              const IconComponent = item.icon;
                              return (
                                 <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => setCatIcon(item.name)}
                                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all outline-none cursor-pointer ${
                                       catIcon === item.name 
                                       ? 'bg-zinc-900 border-zinc-950 text-white shadow-md scale-95' 
                                       : 'bg-zinc-50 border-zinc-100 hover:border-zinc-300 text-zinc-500 hover:text-zinc-800'
                                    }`}
                                    title={item.label}
                                 >
                                    <IconComponent size={16} />
                                    <span className="text-[9px] font-medium leading-none block truncate max-w-full">{item.name}</span>
                                 </button>
                              );
                           })}
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                     <button
                        type="button"
                        onClick={() => setShowAddCategoryForm(false)}
                        className="px-4 py-2 bg-zinc-200 text-zinc-750 hover:bg-zinc-300 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all"
                     >
                        Hủy
                     </button>
                     <button
                        type="submit"
                        className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-sm"
                     >
                        {editingCategory ? 'Lưu cập nhật' : 'Xác nhận tạo dựng'}
                     </button>
                  </div>
               </form>
            )}

            {/* List Table of Categories */}
            <div className="overflow-x-auto border border-zinc-100 rounded-2xl">
               <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-zinc-400 font-extrabold uppercase bg-zinc-50 tracking-wider">
                     <tr>
                        <th className="px-6 py-4 font-bold">Mã ID</th>
                        <th className="px-6 py-4 font-bold">Icon mẫu</th>
                        <th className="px-6 py-4 font-bold">Nhãn tiếng Việt</th>
                        <th className="px-6 py-4 font-bold">Nhãn tiếng Anh</th>
                        <th className="px-6 py-4 font-bold text-center">Tổng thiết kế lưu trữ</th>
                        <th className="px-6 py-4 font-bold text-right">Biên điều khiển</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 divide-dashed">
                     {categories.map(cat => {
                        const linkedProdsCount = products.filter(p => p.categoryId === cat.id).length;
                        return (
                           <tr key={cat.id} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="px-6 py-4 font-mono text-[11px] font-bold text-zinc-500">#{cat.id}</td>
                              <td className="px-6 py-4">
                                 <span className="inline-flex p-2 bg-rose-50 text-rose-500 rounded-lg">
                                    <Sparkles size={14}/>
                                 </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-zinc-850 text-xs uppercase tracking-wide">{cat.name.vi}</td>
                              <td className="px-6 py-4 text-zinc-500 text-xs italic">{cat.name.en}</td>
                              <td className="px-6 py-4 text-center">
                                 <span className="font-mono text-xs font-black bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full">
                                    {linkedProdsCount} sản phẩm
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-1.5">
                                    <button
                                       onClick={() => startEditCategory(cat)}
                                       className="p-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded transition-colors"
                                       title="Sửa danh mục"
                                    >
                                       <Edit size={13}/>
                                    </button>
                                    <button
                                       onClick={() => handleDeleteCategory(cat.id)}
                                       className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded transition-colors"
                                       title="Xóa danh mục"
                                    >
                                       <Trash2 size={13}/>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* Profile listings & details checking */}
      {activeSubTab === 'users' && (
         <div className="bg-white rounded-3xl border border-zinc-100/80 shadow-sm overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-55/70">
               <div>
                  <h3 className="font-serif font-black uppercase tracking-wide text-zinc-800 text-lg">Danh bạ hội viên cao cấp (VIP SIHA)</h3>
                  <p className="text-rose-500 text-xs mt-1">Thông số số đo, kích cỡ váy giày cùng sở thích thời trang chi tiết được kiểm định trước khi thêu dán.</p>
               </div>
               
               <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                     <Search size={15}/>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tìm thành viên..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2 bg-zinc-50 outline-none rounded-xl border border-zinc-100 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all font-medium" 
                  />
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-zinc-400 font-extrabold uppercase bg-zinc-50 tracking-wider">
                     <tr>
                        <th className="px-6 py-4 font-bold">Hội viên</th>
                        <th className="px-6 py-4 font-bold">Số đo chi tiết</th>
                        <th className="px-6 py-4 font-bold">Váy / Giày khuyên dùng</th>
                        <th className="px-6 py-4 font-bold">Vibe thời trang</th>
                        <th className="px-6 py-4 font-bold">Quyền hạn</th>
                        <th className="px-6 py-4 font-bold text-right">Lựa chọn</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                     {allUsers
                       .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                       .map(u => (
                          <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                             
                             {/* User name & avatar */}
                             <td className="px-6 py-4">
                                <div className="flex gap-3 items-center">
                                   <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 overflow-hidden flex items-center justify-center shrink-0">
                                      <img 
                                        src={u.profile?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.id)}`} 
                                        alt="" 
                                        className="w-full h-full object-cover" 
                                      />
                                   </div>
                                   <div>
                                      <p className="font-bold text-zinc-800 uppercase tracking-wide">{u.name}</p>
                                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{u.email}</p>
                                      {u.profile?.phone && <p className="text-[10px] text-zinc-500 font-mono">{u.profile.phone}</p>}
                                   </div>
                                </div>
                             </td>

                             {/* Measurements */}
                             <td className="px-6 py-4">
                                {u.profile?.height && u.profile?.weight ? (
                                   <div className="space-y-0.5">
                                      <p className="font-bold text-zinc-700">Cao: {u.profile.height} cm</p>
                                      <p className="font-bold text-zinc-700">Nặng: {u.profile.weight} kg</p>
                                   </div>
                                ) : (
                                   <span className="text-zinc-400">Chưa tự thiết đặt</span>
                                )}
                             </td>

                             {/* Recommended size */}
                             <td className="px-6 py-4">
                                {u.profile?.dressSize || u.profile?.shoeSize ? (
                                   <div className="space-y-1">
                                      {u.profile.dressSize && <span className="bg-rose-50 text-rose-600 font-black px-2 py-0.5 rounded text-[10px] border border-rose-100">VÁY SIZE {u.profile.dressSize}</span>}
                                      {u.profile.shoeSize && <span className="bg-zinc-100 text-zinc-600 font-black px-2 py-0.5 rounded text-[10px] border border-zinc-200 block max-w-max">GIÀY SIZE {u.profile.shoeSize}</span>}
                                   </div>
                                ) : (
                                   <span className="text-zinc-400">Chưa tự đo</span>
                                )}
                             </td>

                             {/* Style prefer Vibe */}
                             <td className="px-6 py-4">
                                <span className="font-semibold text-zinc-600 bg-pink-50/40 text-pink-700 border border-pink-100 px-3 py-1 rounded-full">
                                   {u.profile?.preferredStyle || 'Chưa thiết lập'}
                                </span>
                             </td>

                             {/* User level role */}
                             <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${u.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-zinc-100 text-zinc-600'}`}>
                                   {u.role}
                                </span>
                             </td>

                             {/* Role controls */}
                             <td className="px-6 py-4 text-right">
                                <div className="flex gap-2 justify-end">
                                   <button 
                                      onClick={() => handleToggleUserRole(u)}
                                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border border-zinc-200"
                                      title="Toggle user / admin privileges"
                                   >
                                      Sửa vai trò
                                   </button>
                                   <button 
                                      onClick={() => handleDeleteUser(u.id)}
                                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-100 transition-colors"
                                      title="Xóa vĩnh viễn"
                                   >
                                      <Trash2 size={13}/>
                                   </button>
                                </div>
                             </td>

                          </tr>
                       ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* Contract / Bookings dashboard controller with active actions */}
      {activeSubTab === 'orders' && (
         <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden animate-in fade-in space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h3 className="font-serif font-black uppercase tracking-wide text-zinc-800 text-lg">Hợp đồng cho thuê đầm SIHA</h3>
                  <p className="text-zinc-500 text-xs mt-1">Duyệt hoặc bàn giao lịch trình thêu váy cho khách hàng, cập nhật nẹp nếp vóc dáng.</p>
               </div>

               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-start sm:items-center">
                  {/* Sorting orders dropdown */}
                  <div className="relative shrink-0 font-sans">
                     <button
                        type="button"
                        onClick={() => setIsOrderSortOpen(!isOrderSortOpen)}
                        className="text-xs pl-3 pr-10 py-2 bg-zinc-50 border border-zinc-150 rounded-xl outline-none focus:border-rose-400 font-bold text-zinc-650 transition-all hover:bg-zinc-100/60 cursor-pointer flex items-center justify-between min-w-[200px]"
                     >
                        <span>
                           {orderSort === 'date-desc' && 'Thời gian: Gần đây nhất'}
                           {orderSort === 'date-asc' && 'Thời gian: Cũ nhất'}
                           {orderSort === 'total-desc' && 'Giá trị hợp đồng: Cao → Thấp'}
                           {orderSort === 'total-asc' && 'Giá trị hợp đồng: Thấp → Cao'}
                        </span>
                     </button>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                        <ArrowUpDown size={12} />
                     </div>

                     {isOrderSortOpen && (
                        <>
                           <div className="fixed inset-0 z-20" onClick={() => setIsOrderSortOpen(false)} />
                           <div className="absolute right-0 mt-1 w-56 bg-white border border-zinc-100 rounded-2xl shadow-xl z-30 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 text-xs text-zinc-700">
                              {[
                                 { value: 'date-desc', label: 'Thời gian: Gần đây nhất' },
                                 { value: 'date-asc', label: 'Thời gian: Cũ nhất' },
                                 { value: 'total-desc', label: 'Giá trị hợp đồng: Cao → Thấp' },
                                 { value: 'total-asc', label: 'Giá trị hợp đồng: Thấp → Cao' }
                              ].map((opt) => (
                                 <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                       setOrderSort(opt.value as any);
                                       setIsOrderSortOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-1.5 hover:bg-zinc-50 font-semibold transition-colors flex items-center justify-between ${
                                       orderSort === opt.value ? 'text-rose-600 bg-rose-50/45' : 'text-zinc-650'
                                    }`}
                                 >
                                    <span>{opt.label}</span>
                                    {orderSort === opt.value && <Check size={12} className="text-rose-500" />}
                                 </button>
                              ))}
                           </div>
                        </>
                     )}
                  </div>

                  {/* Filter categories */}
                  <div className="flex gap-2 flex-wrap text-xs">
                     {[
                       { id: 'all', label: 'Tất cả trạng thái' },
                       { id: 'pending', label: 'Chờ duyệt / Xử lý' },
                       { id: 'processing', label: 'Đang chuẩn bị' },
                       { id: 'shipped', label: 'Đang giao' },
                       { id: 'delivered', label: 'Đang thuê' },
                       { id: 'cancelled', label: 'Đã hủy' }
                     ].map(filter => (
                        <button
                           key={filter.id}
                           onClick={() => setOrderFilter(filter.id)}
                           className={`px-4 py-2 rounded-xl font-bold transition-all ${orderFilter === filter.id ? 'bg-zinc-900 text-white shadow-sm' : 'bg-[#fafafa] text-zinc-500 border border-zinc-100 hover:border-zinc-300'}`}
                        >
                           {filter.label}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto -mx-6">
               <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-zinc-400 font-extrabold uppercase bg-zinc-50 tracking-wider">
                     <tr>
                        <th className="px-6 py-4 font-bold">Mã Đơn / Khách hàng</th>
                        <th className="px-6 py-4 font-bold">Danh mục đồ thuê</th>
                        <th className="px-6 py-4 font-bold">Tổng hoá đơn</th>
                        <th className="px-6 py-4 font-bold">Lược đồ thời gian</th>
                        <th className="px-6 py-4 font-bold">Trạng thái xử lý</th>
                        <th className="px-6 py-4 font-bold text-right">Chi tiết hợp đồng</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                     {allOrders
                       .filter(o => orderFilter === 'all' || o.status === orderFilter)
                       .map(o => {
                          const client = allUsers.find(u => u.id === o.userId);
                          return (
                             <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                                
                                {/* Info client */}
                                <td className="px-6 py-4">
                                   <div className="space-y-1">
                                      <p className="font-bold text-zinc-900 font-mono">#{o.id}</p>
                                      <p className="text-zinc-600 font-medium">{client?.name || 'Khách Vãng Lai'}</p>
                                      <p className="text-[10px] text-rose-500">{client?.profile?.phone || 'Chưa để lại SĐT'}</p>
                                   </div>
                                </td>

                                {/* Items leased and sizes details */}
                                <td className="px-6 py-4">
                                   <div className="space-y-1">
                                      {o.items.map((it, idx) => (
                                         <p key={idx} className="text-zinc-600">
                                            - ID {it.productId} x {it.quantity} món (${it.price}/ngày)
                                         </p>
                                      ))}
                                      {client?.profile?.dressSize && (
                                         <span className="text-[9px] uppercase font-bold text-rose-500 bg-rose-50 border border-rose-100/50 px-1.5 py-0.5 rounded">
                                            Yêu cầu size: {client.profile.dressSize}
                                         </span>
                                      )}
                                   </div>
                                </td>

                                {/* Total revenue generated */}
                                <td className="px-6 py-4 font-bold text-zinc-950 font-mono">
                                   ${o.total}
                                </td>

                                {/* Days counter */}
                                <td className="px-6 py-4">
                                   {o.startDate && o.endDate ? (
                                      <div className="space-y-1 text-[11px] text-zinc-500">
                                         <p>Từ: <b className="font-semibold text-zinc-700">{new Date(o.startDate).toLocaleDateString('vi-VN')}</b></p>
                                         <p>Đến: <b className="font-semibold text-zinc-700">{new Date(o.endDate).toLocaleDateString('vi-VN')}</b></p>
                                         <span className="bg-rose-50/60 text-rose-600 text-[9px] font-bold px-2 py-0.5 rounded border border-rose-100/40">{calculateDays(o.startDate, o.endDate)} ngày thuê</span>
                                      </div>
                                   ) : (
                                      <span className="text-zinc-400">Chưa bổ sung lịch</span>
                                   )}
                                </td>

                                {/* Live order statuses updates dropdown */}
                                <td className="px-6 py-4">
<button
                                       type="button"
                                       onClick={() => setActiveStatusDropdownId(activeStatusDropdownId === o.id ? null : o.id)}
                                       className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[10px] outline-none border transition-all inline-flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] shadow-sm ${
                                          o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-zinc-200/50' :
                                          o.status === 'shipped' ? 'bg-cyan-50 text-cyan-600 border-zinc-200/50' :
                                          o.status === 'processing' ? 'bg-blue-50 text-blue-600 border-zinc-200/50' :
                                          o.status === 'cancelled' ? 'bg-zinc-100 text-zinc-400 border-zinc-200/50' :
                                          'bg-amber-50 text-amber-600 border-zinc-200/50'
                                       }`}
                                    >
                                       <span className={`w-1.5 h-1.5 rounded-full ${
                                          o.status === 'delivered' ? 'bg-emerald-500' :
                                          o.status === 'shipped' ? 'bg-cyan-500' :
                                          o.status === 'processing' ? 'bg-blue-500' :
                                          o.status === 'cancelled' ? 'bg-zinc-400' :
                                          'bg-amber-500'
                                       }`} />
                                       <span>
                                          {o.status === 'pending' && 'Chờ xử lý'}
                                          {o.status === 'processing' && 'Chuẩn bị đồ'}
                                          {o.status === 'shipped' && 'Giao shipper'}
                                          {o.status === 'delivered' && 'Đã nhận / Đang thuê'}
                                          {o.status === 'cancelled' && 'Hủy đơn'}
                                       </span>
                                       <span className="text-[8px] opacity-60">▼</span>
                                    </button>

                                    {activeStatusDropdownId === o.id && (
                                       <>
                                          <div className="fixed inset-0 z-10" onClick={(e) => {
                                             e.stopPropagation();
                                             setActiveStatusDropdownId(null);
                                          }} />
                                          <div className="absolute left-0 mt-1 w-44 bg-white border border-zinc-100 rounded-xl shadow-xl z-25 py-1.5 text-[11px] text-zinc-700 animate-in fade-in slide-in-from-top-1 overflow-hidden">
                                             {[
                                                { value: 'pending', label: 'Chờ xử lý', color: 'bg-amber-500' },
                                                { value: 'processing', label: 'Chuẩn bị đồ', color: 'bg-blue-500' },
                                                { value: 'shipped', label: 'Giao shipper', color: 'bg-cyan-500' },
                                                { value: 'delivered', label: 'Đã nhận / Đang thuê', color: 'bg-emerald-500' },
                                                { value: 'cancelled', label: 'Hủy đơn', color: 'bg-zinc-400' }
                                             ].map((opt) => (
                                                <button
                                                   key={opt.value}
                                                   type="button"
                                                   onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleUpdateOrderStatus(o.id, opt.value as OrderStatus);
                                                      setActiveStatusDropdownId(null);
                                                   }}
                                                   className={`w-full text-left px-3.5 py-2 font-bold transition-colors flex items-center gap-2 ${
                                                      o.status === opt.value ? 'bg-rose-50/45 text-rose-600' : 'hover:bg-zinc-50 text-zinc-650'
                                                   }`}
                                                >
                                                   <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                                                   <span>{opt.label}</span>
                                                   {o.status === opt.value && <span className="ml-auto text-rose-500 font-sans">✓</span>}
                                                </button>
                                             ))}
                                          </div>
                                       </>
                                    )}

                                    <select
                                       style={{ display: "none" }}
                                       value={o.status}
                                       onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                                       className={`px-3 py-2 rounded-xl font-bold font-mono text-[10px] outline-none border transition-all ${
                                          o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                          o.status === 'shipped' ? 'bg-cyan-50 text-cyan-600 border-cyan-200' :
                                          o.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                          o.status === 'cancelled' ? 'bg-zinc-100 text-zinc-400 border-zinc-200' :
                                          'bg-amber-50 text-amber-600 border-amber-200'
                                       }`}
                                    >
                                       <option value="pending">Chờ xử lý</option>
                                       <option value="processing">Chuẩn bị đồ</option>
                                       <option value="shipped">Giao shipper</option>
                                       <option value="delivered">Đã nhận / Đang thuê</option>
                                       <option value="cancelled">Hủy đơn</option>
                                    </select>
                                </td>

                             </tr>
                          );
                       })}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* Luxury dialog form modal for adding or editing fashion designs */}
      {showAddForm && (
         <div className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl relative border border-rose-100 select-none flex flex-col scale-95 duration-200 max-h-[90vh]">
               
               <div className="bg-zinc-900 p-6 text-white text-center relative">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-rose-400">SIHA Boutique Catalog</span>
                  <h3 className="text-lg font-serif tracking-[0.14em] uppercase font-black text-white mt-1">
                     {editingProduct ? 'Chỉnh sửa sản phẩm thời trang' : 'Bổ sung thiết kế dạ hội mới'}
                  </h3>
                  <button 
                     onClick={() => setShowAddForm(false)} 
                     className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors"
                  >
                     ✕
                  </button>
               </div>

               <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-zinc-700 text-xs">
                  
                  {/* Category choices */}
                  <div>
                     <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1.5">Bộ Sưu Tập / Danh mục</label>
                     <div className="grid grid-cols-2 gap-2">
                        {categories.map(cat => (
                           <button
                              key={cat.id}
                              type="button"
                              onClick={() => setPCategoryId(cat.id)}
                              className={`py-2.5 rounded-lg border text-[11px] font-bold text-center transition-all ${pCategoryId === cat.id ? 'bg-zinc-900 text-white border-zinc-950' : 'bg-white border-zinc-100 hover:border-rose-100 text-zinc-500'}`}
                           >
                              {cat.name[lang]}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1.5">Tên tiếng Việt</label>
                        <input 
                          type="text" 
                          required
                          value={pNameVi}
                          onChange={e => setPNameVi(e.target.value)}
                          placeholder="Đầm Dạ Hội Công Chúa"
                          className="w-full bg-zinc-50 outline-none text-xs px-3.5 py-3 rounded-xl border border-zinc-100 font-semibold" 
                        />
                     </div>
                     <div>
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1.5">Tên tiếng Anh (English Name)</label>
                        <input 
                          type="text" 
                          required
                          value={pNameEn}
                          onChange={e => setPNameEn(e.target.value)}
                          placeholder="Cinderella Princess Gown"
                          className="w-full bg-zinc-50 outline-none text-xs px-3.5 py-3 rounded-xl border border-zinc-100 font-semibold" 
                        />
                     </div>
                  </div>

                  {/* Prices & Stocks */}
                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1.5">Giá thuê ($/ngày)</label>
                        <input 
                          type="number" 
                          required
                          min="1"
                          value={pPrice}
                          onChange={e => setPPrice(Number(e.target.value))}
                          className="w-full bg-zinc-50 outline-none text-xs px-3.5 py-3 rounded-xl border border-zinc-100 font-bold" 
                        />
                     </div>
                     <div>
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1.5">Giá gốc ($)</label>
                        <input 
                          type="number" 
                          required
                          min="1"
                          value={pOriginalPrice}
                          onChange={e => setPOriginalPrice(Number(e.target.value))}
                          className="w-full bg-zinc-50 outline-none text-xs px-3.5 py-3 rounded-xl border border-zinc-100 font-bold" 
                        />
                     </div>
                     <div>
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1.5">Tồn kho mẫu</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          value={pStock}
                          onChange={e => setPStock(Number(e.target.value))}
                          className="w-full bg-zinc-50 outline-none text-xs px-3.5 py-3 rounded-xl border border-zinc-100 font-bold" 
                        />
                     </div>
                  </div>

                  {/* Image link */}
                  <div>
                     <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1.5">URL hình ảnh váy đầm</label>
                     <input 
                       type="text" 
                       value={pImage}
                       onChange={e => setPImage(e.target.value)}
                       placeholder="https://images.unsplash.com/photo-..."
                       className="w-full bg-zinc-50 outline-none text-xs px-3.5 py-3 rounded-xl border border-zinc-100 font-mono" 
                     />
                  </div>

                  {/* Flash sale toggling option */}
                  <label className="flex items-center gap-3 p-3 bg-rose-50/40 rounded-xl border border-rose-100/50 cursor-pointer">
                     <input 
                       type="checkbox" 
                       checked={pIsFlashSale} 
                       onChange={e => setPIsFlashSale(e.target.checked)} 
                       className="w-4 h-4 text-rose-500 accent-rose-500 rounded" 
                     />
                     <div>
                        <span className="font-bold text-zinc-800">Đặt làm bộ sưu tập đề xuất (Khuyến mãi Flash Sale)</span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Giảm giá thuê hiển thị ngay trên mặt tiền cửa hàng</span>
                     </div>
                  </label>

               </form>

               {/* Print action bottom */}
               <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex gap-2">
                  <button 
                     onClick={handleProductSubmit}
                     className="flex-1 py-3.5 bg-zinc-900 hover:bg-rose-600 text-white text-[10px] font-black tracking-widest uppercase rounded-xl transition-all"
                  >
                     {editingProduct ? 'Cập Nhật Thiết Kế' : 'Bổ Sung Ngay'}
                  </button>
                  <button 
                     onClick={() => setShowAddForm(false)}
                     className="flex-1 py-3.5 bg-white hover:bg-[#fafafa] border border-zinc-200 text-zinc-500 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all"
                  >
                     Quay Lại
                  </button>
               </div>

            </div>
         </div>
      )}

      {/* Contract / Detailed Invoice Modal Popup */}
      {selectedOrderForDetail && (() => {
         const client = allUsers.find(u => u.id === selectedOrderForDetail.userId);
         return (
            <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
               <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-100 flex flex-col scale-95 duration-200 max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
                  
                  {/* Decorative vintage header */}
                  <div className="bg-zinc-900 px-6 py-5 text-white flex justify-between items-center print:bg-white print:text-zinc-900 print:p-0 print:border-b print:border-zinc-200">
                     <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-rose-400 print:text-zinc-500">BIÊN BẢN HỢP ĐỒNG MAY & THUÊ ĐẦM</span>
                        <h3 className="text-sm font-serif tracking-widest uppercase font-black">MÃ SỐ: #{selectedOrderForDetail.id}</h3>
                     </div>
                     <div className="flex gap-2 items-center print:hidden">
                        <button 
                           onClick={() => {
                              window.print();
                           }}
                           className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-bold uppercase select-none transition-colors border border-zinc-700"
                        >
                           <Printer size={12}/> In Hợp đồng
                        </button>
                        <button 
                           onClick={() => setSelectedOrderForDetail(null)} 
                           className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors"
                        >
                           ✕
                        </button>
                     </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-700 print:overflow-visible">
                     
                     {/* Parties Block */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-100">
                        {/* Lessor SIHA */}
                        <div className="space-y-2">
                           <h4 className="font-serif font-extrabold text-zinc-900 border-l-2 border-zinc-900 pl-2 uppercase tracking-wide">BÊN CHO THUÊ (SIHA BOUTIQUE)</h4>
                           <div className="space-y-1 text-zinc-500 font-medium">
                              <p>Cửa hàng: SIHA Boutique - Đầm Dạ Hội Thiết Kế Cao Cấp</p>
                              <p>Hotline hỗ trợ: +84 SIHA-VIP-FASHION</p>
                              <p>Chịu trách nhiệm: Ban Quản Trị Cửa Hàng</p>
                           </div>
                        </div>

                        {/* Lessee User */}
                        <div className="space-y-2">
                           <h4 className="font-serif font-extrabold text-zinc-900 border-l-2 border-rose-400 pl-2 uppercase tracking-wide">BÊN THUÊ (KHÁCH HÀNG VIP)</h4>
                           <div className="space-y-1">
                              <p className="font-bold text-zinc-900 uppercase">{client?.name || 'Khách vãng lai đăng ký trực tiếp'}</p>
                              <p className="text-zinc-500">Email: <span className="font-mono text-zinc-700">{client?.email || 'N/A'}</span></p>
                              <p className="text-zinc-500">Số điện thoại: <span className="font-mono font-bold text-rose-500">{client?.profile?.phone || 'N/A'}</span></p>
                              
                              {/* VIP Measurements check overlay */}
                              {client?.profile?.dressSize && (
                                 <div className="mt-2 bg-zinc-50 p-2 rounded-lg border border-zinc-100 grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                                    <p>• Số đo váy: <b>Size {client.profile.dressSize}</b></p>
                                    <p>• Chiều cao: <b>{client.profile.height || 'N/A'} cm</b></p>
                                    <p>• Cân nặng: <b>{client.profile.weight || 'N/A'} kg</b></p>
                                    <p>• Ưu tiên: <b>{client.profile.preferredStyle || 'N/A'}</b></p>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Rented Items List inside high contrast grid */}
                     <div className="space-y-2">
                        <h4 className="font-serif font-extrabold text-zinc-900 uppercase tracking-widest text-[11px] mb-3">DANH MỤC THIẾT KẾ ĐẶT THUÊ CHÍNH THỨC</h4>
                        <div className="space-y-2.5">
                           {selectedOrderForDetail.items.map((it, idx) => {
                              // Find actual product info to render image thumbnail
                              const prod = products.find(p => p.id === it.productId);
                              return (
                                 <div key={idx} className="flex gap-4 p-3 bg-zinc-50 border border-zinc-100 rounded-xl items-center">
                                    <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/50">
                                       <img 
                                          src={prod?.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200'} 
                                          alt="" 
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full object-cover" 
                                       />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <p className="font-bold text-zinc-950 truncate uppercase tracking-tight text-[11px]">{prod?.name[lang] || `Sản phẩm số #${it.productId}`}</p>
                                       <p className="text-[10px] text-zinc-400 mt-0.5">Mã thiết kế: #{it.productId} | Thuê {it.quantity} chiếc</p>
                                    </div>
                                    <div className="text-right">
                                       <span className="font-mono text-zinc-500 font-medium block text-[10px]">${it.price} / ngày</span>
                                       <span className="font-mono font-bold text-zinc-900 text-xs">${it.price * it.quantity}</span>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     {/* Estimated parameters */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-rose-50/20 border border-rose-100/50 p-4 rounded-xl text-[11px]">
                        <div className="space-y-1">
                           <p className="text-zinc-400 uppercase font-bold text-[9px]">Lược đồ thuê may mẫu</p>
                           {selectedOrderForDetail.startDate && selectedOrderForDetail.endDate ? (
                              <p className="text-zinc-700 font-medium pt-1">
                                 Hợp đồng có hiệu lực trong <b className="text-rose-500 font-extrabold">{calculateDays(selectedOrderForDetail.startDate, selectedOrderForDetail.endDate)} ngày</b> 
                                 <span className="block text-[10px] text-zinc-500 mt-1">Từ <b>{new Date(selectedOrderForDetail.startDate).toLocaleDateString('vi-VN')}</b> tới <b>{new Date(selectedOrderForDetail.endDate).toLocaleDateString('vi-VN')}</b></span>
                              </p>
                           ) : (
                              <p className="text-zinc-500 italic pt-1">Chưa cập nhật ngày bàn giao</p>
                           )}
                        </div>

                        <div className="space-y-1 text-right">
                           <p className="text-zinc-400 uppercase font-bold text-[9px]">Tài chính hợp đồng</p>
                           <p className="text-lg font-serif text-zinc-900 font-black pt-1">${selectedOrderForDetail.total}</p>
                           <p className="text-[10px] text-zinc-400 font-medium">Đặt cọc giữ đồ: Đã thế chân chứng thư VIP</p>
                        </div>
                     </div>

                     {/* Terms and guarantees statement */}
                     <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/50 text-[10px] text-zinc-500 space-y-1 leading-relaxed">
                        <p className="font-black text-zinc-700 uppercase tracking-wider text-[9px]">Điều khoản May & Thuê đầm thiết kế cao cấp:</p>
                        <p>1. Bên Thuê cam kết bảo toàn nguyên vẹn tà váy thêu thủ công, không tẩy rửa hóa chất lạ lên vải lụa tơ tằm.</p>
                        <p>2. Trong trường hợp có hư hại hạt thêu đính đá quý hoặc rách nẹp ren, phí đền bù dựa trên giá gốc đã niêm yết của tác phẩm thời trang đó.</p>
                     </div>

                     {/* Digital representation signatures */}
                     <div className="grid grid-cols-2 gap-2 text-center pt-4 border-t border-zinc-100">
                        <div>
                           <p className="font-bold text-zinc-550 uppercase tracking-widest text-[9px] mb-3">Bên cho thuê (SIHA Boutique)</p>
                           <div className="h-12 flex items-center justify-center italic text-rose-500 font-mono select-none font-bold">
                              SIHA Certified Shop
                           </div>
                           <p className="text-[9px] text-zinc-400">Đã kiểm duyệt & Đóng dấu điện tử</p>
                        </div>

                        <div>
                           <p className="font-bold text-zinc-550 uppercase tracking-widest text-[9px] mb-3">Bên thuê (Đại diện VIP)</p>
                           <div className="h-12 flex items-center justify-center font-serif text-zinc-800 font-black tracking-widest uppercase text-xs">
                              {client?.name ? client.name.substring(0, 15) : 'Ký Số Trực Tuyến'}
                           </div>
                           <p className="text-[9px] text-zinc-400">Ký số xác nhận qua cổng thành viên</p>
                        </div>
                     </div>

                  </div>

                  {/* Actions for order updates inside modal */}
                  <div className="bg-zinc-50 border-t border-zinc-100 p-4 flex gap-2 justify-end print:hidden">
                     
                     {selectedOrderForDetail.status === 'pending' && (
                        <button
                           onClick={() => {
                              handleUpdateOrderStatus(selectedOrderForDetail.id, 'processing');
                              setSelectedOrderForDetail(null);
                           }}
                           className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                        >
                           Phê duyệt hợp đồng (Xử lý đồ)
                        </button>
                     )}

                     <button
                        onClick={() => setSelectedOrderForDetail(null)}
                        className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-500 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all hover:bg-zinc-100"
                     >
                        Quay về quản lý
                     </button>
                  </div>

               </div>
            </div>
         );
      })()}

    </div>
  );
};
