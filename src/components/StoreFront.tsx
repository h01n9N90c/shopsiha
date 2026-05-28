import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useServices } from '../contexts/ServiceContext';
import { Product, Category } from '../types';
import { ShoppingBag, Star, Zap, Flame, LayoutGrid, Heart, Sparkles, Filter, Search, Shirt, Camera } from 'lucide-react';

const CategoryIcon = ({ iconName, isActive }: { iconName: string, isActive: boolean }) => {
  const iconProps = { size: 16, className: isActive ? "text-white" : "text-zinc-400 group-hover:text-pink-500 transition-colors" };
  switch (iconName) {
    case 'Shirt': return <Shirt {...iconProps} />;
    case 'Camera': return <Camera {...iconProps} />;
    case 'Sparkles': return <Sparkles {...iconProps} />;
    case 'ShoppingBag': return <ShoppingBag {...iconProps} />;
    default: return <LayoutGrid {...iconProps} />;
  }
};

export const StoreFront: React.FC = () => {
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const { productService } = useServices();

  const [categories, setCategories] = useState<Category[]>([]);
  const [flashSale, setFlashSale] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 45, seconds: 12 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setCategories(await productService.getCategories());
      setFlashSale(await productService.getFlashSaleProducts());
      setProducts(await productService.getAllProducts());
    };
    fetchData();
  }, [productService]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setToastMessage(`Đã thêm ${product.name[lang]} vào giỏ hàng`);
    setTimeout(() => setToastMessage(null), 3000);
  }

  let displayProducts = selectedCategory 
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      p.name[lang].toLowerCase().includes(term) || 
      p.categoryId.toLowerCase().includes(term)
    );
  }

  if (selectedPriceFilter === 'under50') {
    displayProducts = displayProducts.filter(p => p.price < 50);
  } else if (selectedPriceFilter === '50to100') {
    displayProducts = displayProducts.filter(p => p.price >= 50 && p.price <= 100);
  } else if (selectedPriceFilter === 'over100') {
    displayProducts = displayProducts.filter(p => p.price > 100);
  }

  return (
    <div className="w-full min-h-screen pb-24 text-zinc-800">
      
      {/* Decorative Hero Area */}
      <div className="bg-gradient-to-br from-rose-50/40 via-[#fdfdfc] to-pink-50/30 w-full overflow-hidden relative border-b border-rose-100/50 py-10 md:py-16">
         <div className="absolute top-10 w-[500px] h-[500px] bg-rose-200/10 rounded-full mix-blend-multiply blur-3xl -left-20"></div>
         <div className="absolute bottom-10 w-[500px] h-[500px] bg-fuchsia-100/10 rounded-full mix-blend-multiply blur-3xl right-10"></div>
         
         {/* Nature Overlay Effect */}
         <div className="absolute inset-0 opacity-[0.02] bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay"></div>

         <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 relative z-10 flex flex-col items-center justify-center">
            <span className="px-4 py-1 bg-white/80 backdrop-blur-md rounded-full text-rose-500 text-[10px] md:text-xs font-bold mb-4 md:mb-6 shadow-[0_4px_10px_rgba(225,29,72,0.04)] border border-rose-100/60 flex items-center gap-2 uppercase tracking-[0.25em]">
               <Sparkles size={11} className="text-rose-400 fill-rose-50"/> SIHA Boutique
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 md:mb-6 tracking-tight text-center font-serif leading-[1.2] text-zinc-900">
              Tỏa sáng trọn vẹn,<br className="hidden sm:inline" />
              <span className="font-semibold italic text-rose-500 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500">không ngại chi phí.</span>
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm md:text-base mb-6 md:mb-10 text-center font-medium max-w-lg leading-relaxed px-2 md:px-0">
               Trải nghiệm những thiết kế dạ hội cao cấp, đồ brand chính hãng mang tính biểu tượng chỉ với mức phí nhỏ mỗi ngày.
            </p>

            {/* Search Bar centered in Hero */}
            <div className="w-full max-w-md relative flex items-center bg-white/95 backdrop-blur-md p-1 md:p-1.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-rose-100/60 transition-all hover:shadow-[0_15px_45px_rgba(225,29,72,0.08)]">
               <div className="pl-3 md:pl-4 pr-1 md:pr-3 text-rose-300 md:shrink-0"><Search size={16}/></div>
               <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm kiếm váy dạ hội..." className="w-full bg-transparent border-none outline-none text-zinc-700 py-1.5 md:py-2.5 px-2 text-[12px] md:text-sm placeholder:text-zinc-400 placeholder:font-normal font-medium" />
               <button className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500 hover:scale-[1.03] text-white px-5 md:px-7 py-1.5 md:py-2.5 rounded-full text-[11px] md:text-sm font-bold shadow-[0_4px_15px_rgba(225,29,72,0.22)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 md:shrink-0 uppercase tracking-wider text-xs">Tìm kiếm</button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Category / Filter Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
           <div className="md:sticky md:top-28 bg-transparent md:bg-white/80 md:backdrop-blur-xl rounded-none md:rounded-2xl md:p-6 shadow-none md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none md:border md:border-rose-100 p-0">
              <div className="hidden md:flex items-center gap-2 font-bold text-sm mb-6 text-zinc-800 pb-4 border-b border-rose-100/50 uppercase tracking-widest font-serif">
                 <Filter size={14} className="text-rose-400"/> Danh Mục
              </div>
              
              <div className="flex overflow-x-auto md:flex-col gap-2 pb-3 md:pb-0 scrollbar-hide -mx-4 md:mx-0 px-4 md:px-0">
                <button 
                  onClick={() => {
                     setSelectedCategory(null);
                     document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-4 py-2 md:py-2.5 rounded-full md:rounded-xl transition-all text-xs font-semibold ${selectedCategory === null ? 'bg-zinc-900 text-white shadow-md' : 'bg-white md:bg-zinc-50/50 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 border border-rose-100/40'}`}
                >
                   <Heart size={14} className={selectedCategory === null ? 'fill-white' : 'text-zinc-400 group-hover:text-rose-400 transition-colors'}/> <span className="whitespace-nowrap">Tất cả sản phẩm</span>
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => {
                       setSelectedCategory(cat.id);
                       document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`group shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-4 py-2 md:py-2.5 rounded-full md:rounded-xl transition-all text-xs font-semibold ${selectedCategory === cat.id ? 'bg-zinc-900 text-white shadow-md' : 'bg-white md:bg-zinc-50/50 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 border border-rose-100/40'}`}
                  >
                     <CategoryIcon iconName={cat.icon} isActive={selectedCategory === cat.id} />
                     <span className="whitespace-nowrap">{cat.name[lang]}</span>
                  </button>
                ))}
              </div>

              <div className="hidden md:block mt-8 pt-6 border-t border-rose-100/40">
                 <h4 className="font-bold text-[11px] uppercase tracking-widest text-zinc-800 mb-5 opacity-80 font-serif">Mức giá</h4>
                 <div className="space-y-3.5">
                    <label className="flex items-center gap-3 text-xs text-zinc-500 cursor-pointer group">
                       <input type="checkbox" checked={selectedPriceFilter === 'under50'} onChange={() => setSelectedPriceFilter(selectedPriceFilter === 'under50' ? null : 'under50')} className="w-4 h-4 rounded border-rose-200 text-rose-550 focus:ring-rose-500 accent-rose-500"/>
                       <span className="group-hover:text-rose-600 transition-colors">Dưới $50</span>
                    </label>
                    <label className="flex items-center gap-3 text-xs text-zinc-500 cursor-pointer group">
                       <input type="checkbox" checked={selectedPriceFilter === '50to100'} onChange={() => setSelectedPriceFilter(selectedPriceFilter === '50to100' ? null : '50to100')} className="w-4 h-4 rounded border-rose-200 text-rose-550 focus:ring-rose-500 accent-rose-500"/>
                       <span className="group-hover:text-rose-600 transition-colors">$50 - $100</span>
                    </label>
                    <label className="flex items-center gap-3 text-xs text-zinc-500 cursor-pointer group">
                       <input type="checkbox" checked={selectedPriceFilter === 'over100'} onChange={() => setSelectedPriceFilter(selectedPriceFilter === 'over100' ? null : 'over100')} className="w-4 h-4 rounded border-rose-200 text-rose-550 focus:ring-rose-500 accent-rose-500"/>
                       <span className="group-hover:text-rose-600 transition-colors">Trên $100</span>
                    </label>
                 </div>
              </div>
           </div>
        </aside>

        {/* Right Side: Main Content */}
        <main className="flex-1 w-full space-y-12">
           
           {/* Flash Sale Section */}
           {flashSale.length > 0 && selectedCategory === null && (
             <section className="rounded-3xl relative z-0 mb-16 overflow-hidden border border-rose-100/50 shadow-[0_12px_40px_rgba(225,29,72,0.02)]">
               <div className="bg-gradient-to-br from-[#fdfbfb] via-[#fffbfb] to-[#fff5f6] rounded-[inherit] overflow-hidden p-6 md:p-10 relative">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-rose-200/10 rounded-bl-full pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200/10 rounded-tr-full pointer-events-none"></div>
                 <div className="flex flex-wrap items-center justify-between mb-8 gap-4 relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-rose-100 flex items-center justify-center">
                         <Zap className="fill-rose-400 text-rose-400 w-6 h-6"/>
                      </div>
                      <h2 className="text-xl lg:text-2xl font-black text-zinc-900 tracking-widest font-serif">CHƯƠNG TRÌNH GIỜ VÀNG</h2>
                   </div>
                   <div className="text-xs font-semibold text-zinc-600 flex gap-1.5 items-center bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-rose-100/40 font-serif">
                      Kết thúc trong <span className="bg-rose-500 text-white px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold shadow-sm animate-pulse">{timeLeft.hours.toString().padStart(2, '0')}</span> : <span className="bg-rose-500 text-white px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold shadow-sm animate-pulse">{timeLeft.minutes.toString().padStart(2, '0')}</span> : <span className="bg-rose-500 text-white px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold shadow-sm animate-pulse">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
                   {flashSale.map(product => (
                      <div key={`flash-${product.id}`} className="group bg-white rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_rgba(225,29,72,0.05)] hover:-translate-y-1.5 transition-all duration-500 border border-zinc-100 flex flex-col relative text-center items-center">

                         <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#fafafa] flex items-center justify-center shrink-0">
                           <img src={product.image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                           <div className="hidden md:flex absolute -bottom-12 left-0 right-0 p-4 justify-center opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-300 z-10">
                              <button 
                                 onClick={() => handleAddToCart(product)}
                                 disabled={product.stock === 0}
                                 className="w-full h-10 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-[11px] md:text-xs rounded-full shadow-[0_4px_15px_rgba(244,63,94,0.25)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.4)] transition-all active:scale-95 uppercase tracking-wider duration-300 border border-rose-400/10"
                              >
                                 {product.stock === 0 ? 'Tạm Hết' : 'Thuê Ngay'}
                              </button>
                           </div>
                         </div>
                         <div className="p-3 md:p-5 relative flex-1 flex flex-col bg-white w-full">
                           <span className="text-[9px] text-rose-500 font-bold uppercase tracking-widest mb-1 block">Luxury Collection</span>
                            <h3 className="font-semibold text-zinc-800 text-[11px] md:text-xs mb-2 line-clamp-2 leading-relaxed uppercase tracking-wide h-9 md:h-10 group-hover:text-rose-500 transition-colors">{product.name[lang]}</h3>
                           <div className="flex flex-col items-center justify-center pt-2 mt-auto">
                              <div className="flex items-center gap-2">
                                <span className="text-sm md:text-base font-bold text-rose-500">${product.price}</span>
                                {product.originalPrice && <span className="text-[10px] text-zinc-400 line-through">${product.originalPrice}</span>}
                              </div>
                           </div>
                           <div className="w-full bg-rose-100/50 rounded-full h-1.5 overflow-hidden mt-3">
                              <div className="bg-gradient-to-r from-rose-400 to-pink-400 h-full rounded-full" style={{width: product.id === 'p1' ? '92%' : product.id === 'p4' ? '35%' : product.id === 'p5' ? '75%' : '60%'}}></div>
                           </div>
                           <div className="mt-4 md:hidden">
                              <button 
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                                className="w-full h-[38px] flex items-center justify-center gap-2 bg-zinc-950 hover:bg-rose-600 text-white font-bold text-[11px] rounded-full shadow-md disabled:bg-zinc-50 disabled:text-zinc-300 disabled:cursor-not-allowed transition-all active:scale-95 uppercase tracking-[0.14em] px-3"
                              >
                                 {product.stock === 0 ? 'Tạm Hết' : 'Thuê Ngay'}
                              </button>
                           </div>
                         </div>
                      </div>
                   ))}
                </div>
               </div>
             </section>
           )}

           {/* Product Grid */}
           <section id="product-list" className="pt-4 scroll-mt-24">
             <div className="flex items-center justify-between mb-8 pt-4 border-b border-rose-100/40 pb-4">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-zinc-800 font-serif">
                   <Sparkles size={24} className="text-rose-400"/> {selectedCategory ? 'Sản Phẩm Trong Danh Mục' : 'BỘ SƯU TẬP CHO NÀNG'}
                </h2>
                <div className="text-xs uppercase tracking-widest font-medium text-zinc-400 hidden md:block">Hiển thị {displayProducts.length} thiết kế</div>
             </div>
             
             {displayProducts.length === 0 ? (
                <div className="w-full py-20 bg-white rounded-2xl border border-rose-100 flex flex-col items-center justify-center text-center shadow-sm">
                   <Heart size={48} className="text-rose-200 mb-4"/>
                   <h3 className="text-lg font-bold text-zinc-800 mb-2 font-serif">Chưa có sản phẩm</h3>
                   <p className="text-zinc-500">Thử chọn danh mục khác nhé!</p>
                </div>
             ) : (
                 <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                  {displayProducts.map((product) => (
                    <div key={product.id} className="group bg-white rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_rgba(225,29,72,0.04)] hover:-translate-y-1.5 transition-all duration-500 border border-zinc-100/60 flex flex-col items-center text-center">
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#fafafa] flex items-center justify-center shrink-0">
                        <img src={product.image} alt={product.name[lang]} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
                             <span className="bg-zinc-800 text-white px-4 py-1.5 text-xs font-bold rounded-sm shadow-lg tracking-widest uppercase">TẠM HẾT</span>
                          </div>
                        )}
                        <div className="hidden md:flex absolute -bottom-12 left-0 right-0 p-4 justify-center opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-300 z-10">
                          <button 
                             onClick={() => handleAddToCart(product)}
                             disabled={product.stock === 0}
                             className="w-full h-10 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-[11px] md:text-xs rounded-full shadow-[0_4px_15px_rgba(244,63,94,0.25)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.4)] transition-all active:scale-95 uppercase tracking-wider duration-300 border border-rose-400/10"
                          >
                             {product.stock === 0 ? 'Tạm Hết' : 'Thuê Ngay'}
                          </button>
                        </div>
                      </div>
                      <div className="p-3 md:p-5 flex-1 flex flex-col justify-between w-full bg-white z-20">
                        <div>
                          <h3 className="text-[12px] md:text-[13px] font-medium text-zinc-800 leading-relaxed line-clamp-2 h-9 md:h-10 mb-2 group-hover:text-rose-500 transition-colors uppercase tracking-wide">{product.name[lang]}</h3>
                          <div className="flex justify-center gap-1 md:gap-1.5 items-center mb-0 md:mb-3 hidden md:flex">
                             <div className="flex text-rose-300 gap-0.5"><Star size={10} className="fill-rose-300"/><Star size={10} className="fill-rose-300"/><Star size={10} className="fill-rose-300"/><Star size={10} className="fill-rose-300"/><Star size={10} className="fill-rose-300"/></div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-2 mt-auto">
                          <span className="text-sm md:text-base font-extrabold text-[#7c2d12]">${product.price} <span className="text-[9px] md:text-[10px] font-normal text-zinc-400 uppercase tracking-widest font-serif block mt-1">Giá Thuê Một Ngày</span></span>
                        </div>
                        <div className="mt-4 md:hidden w-full">
                           <button 
                             onClick={() => handleAddToCart(product)}
                             disabled={product.stock === 0}
                             className="w-full h-[38px] flex items-center justify-center gap-2 bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-950 hover:from-rose-500 hover:via-pink-600 hover:to-rose-500 text-white font-black text-[10px] md:text-[11px] rounded-full shadow-md disabled:bg-zinc-100 disabled:text-zinc-300 disabled:cursor-not-allowed transition-all active:scale-95 uppercase tracking-[0.14em] px-3 duration-300"
                           >
                              {product.stock === 0 ? 'Tạm Hết' : 'Thuê Ngay'}
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             )}
           </section>

           {/* Brand Highlights */}
           <section className="mt-25 pt-20 border-t border-rose-100/60 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Introduction Header */}
              <div className="col-span-1 md:col-span-3 text-center max-w-xl mx-auto mb-10">
                 <span className="text-[10px] md:text-sm text-rose-500 font-extrabold uppercase tracking-[0.25em] font-sans block mb-2.5 animate-pulse">Trải nghiệm tinh túy</span>
                 <h2 className="text-2xl md:text-3xl lg:text-4xl font-light font-serif text-zinc-900 tracking-tight leading-tight uppercase">
                   VỀ SIHA <span className="font-semibold italic text-rose-500 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">BOUTIQUE</span>
                 </h2>
                 <p className="text-xs text-zinc-500 mt-4 leading-relaxed max-w-lg mx-auto">
                   Chúng tôi đồng hành cùng nàng trên hành trình tỏa sáng với chuẩn mực dịch vụ cao cấp nhất, chỉn chu đến từng chi tiết nhỏ.
                 </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                 <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-400">
                    <Sparkles size={28}/>
                 </div>
                 <h4 className="font-serif text-lg font-bold text-zinc-800 mb-2 uppercase tracking-wide">Thiết Kế Đỉnh Cao</h4>
                 <p className="text-sm text-zinc-500 leading-relaxed">Tuyển chọn các mẫu váy dạ hội sang trọng, dẫn đầu xu hướng từ các nhà thiết kế nổi tiếng.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                 <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-400">
                    <Heart size={28}/>
                 </div>
                 <h4 className="font-serif text-lg font-bold text-zinc-800 mb-2 uppercase tracking-wide">Giặt Hấp Chuẩn 5 Sao</h4>
                 <p className="text-sm text-zinc-500 leading-relaxed">Mỗi sản phẩm đều được sấy khô, ủi phẳng và xử lý hương thơm cao cấp trước khi đến tay bạn.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                 <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-400">
                    <Star size={28}/>
                 </div>
                 <h4 className="font-serif text-lg font-bold text-zinc-800 mb-2 uppercase tracking-wide">Trải Nghiệm Hoàn Hảo</h4>
                 <p className="text-sm text-zinc-500 leading-relaxed">Đội ngũ stylist luôn sẵn sàng tư vấn để nàng có một diện mạo hoàn hảo nhất trong sự kiện.</p>
              </div>
           </section>

           {/* Instagram Feed / Inspiration */}
           <section className="mt-24 mb-8 pt-12 border-t border-rose-100/40">
             <div className="flex items-center justify-center mb-8">
                <h2 className="hidden">
                   <span className="text-xs text-rose-400 uppercase tracking-[0.3em] font-sans">Instagram</span>
                   @SIHA.Boutique
                </h2>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="aspect-square bg-zinc-100 overflow-hidden relative group">
                   <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Instagram 1"/>
                   <div className="absolute inset-0 bg-rose-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Heart size={24} className="text-white fill-white"/>
                   </div>
                </div>
                <div className="aspect-square bg-zinc-100 overflow-hidden relative group">
                   <img src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Instagram 2"/>
                   <div className="absolute inset-0 bg-rose-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Heart size={24} className="text-white fill-white"/>
                   </div>
                </div>
                <div className="aspect-square bg-zinc-100 overflow-hidden relative group">
                   <img src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Instagram 3"/>
                   <div className="absolute inset-0 bg-rose-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Heart size={24} className="text-white fill-white"/>
                   </div>
                </div>
                <div className="aspect-square bg-zinc-100 overflow-hidden relative group">
                   <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Instagram 4"/>
                   <div className="absolute inset-0 bg-rose-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Heart size={24} className="text-white fill-white"/>
                   </div>
                </div>
             </div>
           </section>

        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-white border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-50 font-medium">
           <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
             <Heart size={16} />
           </div>
           {toastMessage}
        </div>
      )}
    </div>
  );
};
