import React from 'react';
import { Heart, Leaf, Sparkles, MapPin, Camera, Sparkles as Diamond } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* Decorative Hero Area */}
      <div className="bg-gradient-to-br from-[#fafafa] to-rose-50/30 w-full overflow-hidden relative border-b border-rose-100/50">
         <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-rose-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
         <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-pink-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

         <div className="max-w-4xl mx-auto px-4 py-24 md:py-32 relative z-10 flex flex-col items-center justify-center text-center">
            <span className="px-5 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-rose-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-8 shadow-sm border border-rose-100 flex items-center gap-2">
               <Heart size={14}/> Câu Chuyện SIHA
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-zinc-900 font-serif leading-[1.1] tracking-tight">
              Tôn vinh vẻ đẹp nàng, <br /> <span className="text-rose-400 font-light italic">không giới hạn chi phí.</span>
            </h1>
            <p className="text-zinc-500 text-sm md:text-base font-medium leading-relaxed max-w-xl mx-auto mt-6">
               Được sáng lập bởi @quynhhgiaooooo, SIHA Boutique là điểm đến lý tưởng cho các nàng với dịch vụ thuê thiết kế dạ hội cao cấp, đồ brand chính hãng, trải nghiệm máy ảnh film cổ điển và nghệ thuật làm đẹp đẳng cấp.
            </p>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 space-y-24 md:space-y-32">
         <section className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
            <div className="flex-1 space-y-8">
               <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 font-serif leading-tight">
                 Đặc quyền của nàng <br className="hidden lg:block"/> <span className="text-rose-400 italic font-light">tại SIHA</span>
               </h2>
               <div className="space-y-6 text-zinc-500 text-sm leading-relaxed">
                  <p>Chào mừng nàng bước vào không gian tinh tế của SIHA. Chúng mình tự hào mang đến những trải nghiệm mua sắm và làm đẹp chuẩn 5 sao:</p>
                  <ul className="list-none space-y-5">
                     <li className="flex items-start gap-4">
                        <div className="p-2 bg-rose-50 rounded-xl mt-1"><Sparkles size={16} className="text-rose-500"/></div>
                        <div>
                           <strong className="text-zinc-800 block mb-1">Thuê Thiết Kế Cao Cấp</strong>
                           <span>Trải nghiệm đồ brand chính hãng, thiết kế độc bản với mức phí tối ưu (chỉ từ 60k/ngày). Sẵn sàng tỏa sáng mọi sự kiện.</span>
                        </div>
                     </li>
                     <li className="flex items-start gap-4">
                        <div className="p-2 bg-rose-50 rounded-xl mt-1"><Camera size={16} className="text-rose-500"/></div>
                        <div>
                           <strong className="text-zinc-800 block mb-1">Dịch Vụ Visual</strong>
                           <span>Thuê máy ảnh kỹ thuật số, máy film bắt trọn khoảnh khắc nghệ thuật (@tits.digital).</span>
                        </div>
                     </li>
                     <li className="flex items-start gap-4">
                        <div className="p-2 bg-rose-50 rounded-xl mt-1"><Diamond size={16} className="text-rose-500"/></div>
                        <div>
                           <strong className="text-zinc-800 block mb-1">Nail Art Độc Bản</strong>
                           <span>Book lịch thiết kế bộ móng xinh xắn, matching với trang phục.</span>
                        </div>
                     </li>
                  </ul>
                  <div className="bg-[#fafafa] p-6 rounded-2xl border border-rose-100 mt-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-rose-100 rounded-bl-full mix-blend-multiply opacity-50"></div>
                     <p className="font-bold text-rose-500 uppercase tracking-widest text-[10px] mb-2 font-sans">Đặc Quyền Hội Viên</p>
                     <p className="text-sm text-zinc-600">Follower được free phụ kiện đi kèm & Ưu đãi đặc quyền <b>thuê cọc 0đ</b> cho khách quen!</p>
                  </div>
               </div>
            </div>
            <div className="flex-1 w-full relative">
               <div className="aspect-[4/5] rounded-t-[100px] rounded-b-3xl bg-zinc-100 overflow-hidden shadow-2xl shadow-rose-900/10 border-4 border-white relative z-10">
                  <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000" alt="Fashion Wardrobe" className="w-full h-full object-cover" />
               </div>
               <div className="absolute top-10 -right-4 w-full h-full border border-rose-200 rounded-t-[100px] rounded-b-3xl -z-10"></div>
            </div>
         </section>

         <section className="bg-[#fafafa] p-8 md:p-16 rounded-[40px] shadow-sm border border-rose-50 relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 font-serif flex items-center justify-center gap-3 mb-12 text-center uppercase tracking-wide">
               <MapPin className="text-rose-400"/> Không Gian SIHA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
               <div className="bg-white p-8 rounded-3xl border border-rose-50 hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 font-bold font-serif text-lg">01</div>
                  <h3 className="font-bold text-zinc-900 mb-3 text-lg font-serif tracking-wide">Boutique Gò Vấp</h3>
                  <p className="text-zinc-500 text-sm mb-6 leading-relaxed">Không gian trưng bày các BST dạ hội giới hạn, đồ brand chính hãng với phòng thử đồ cao cấp.</p>
                  <a href="https://instagram.com/taphoasiha.govap" target="_blank" rel="noreferrer" className="text-rose-500 font-bold text-xs uppercase tracking-widest hover:text-rose-600 flex items-center gap-2 group-hover:gap-3 transition-all">Ghé thăm IG &rarr;</a>
               </div>
               <div className="bg-white p-8 rounded-3xl border border-rose-50 hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 font-bold font-serif text-lg">02</div>
                  <h3 className="font-bold text-zinc-900 mb-3 text-lg font-serif tracking-wide">Boutique Quận 12</h3>
                  <p className="text-zinc-500 text-sm mb-6 leading-relaxed">61/3 TTA08, tổ 4 Kp4, Phường Thới An, Quận 12. Không gian rộng rãi, đa dạng mẫu mã hot trend.</p>
                  <a href="https://instagram.com/taphoasiha.q12" target="_blank" rel="noreferrer" className="text-rose-500 font-bold text-xs uppercase tracking-widest hover:text-rose-600 flex items-center gap-2 group-hover:gap-3 transition-all">Ghé thăm IG &rarr;</a>
               </div>
            </div>

            <div className="mt-16 border-t border-rose-100/50 pt-12 text-center text-sm md:text-base">
               <h3 className="font-bold text-zinc-900 mb-6 font-serif text-xl">Hệ sinh thái đối tác SIHA</h3>
               <div className="flex flex-wrap justify-center gap-4 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  <span className="px-5 py-2.5 bg-white rounded-full border border-rose-100 hover:border-rose-300 transition-colors">Camera: <b className="text-rose-500 font-bold ml-1">@tits.digital</b></span>
                  <span className="px-5 py-2.5 bg-white rounded-full border border-rose-100 hover:border-rose-300 transition-colors">Cọc 0đ: <b className="text-rose-500 font-bold ml-1">@lunar.digitalcam</b></span>
                  <span className="px-5 py-2.5 bg-white rounded-full border border-rose-100 hover:border-rose-300 transition-colors">Nail Art: <b className="text-rose-500 font-bold ml-1">@tiemnhamyy</b></span>
                  <span className="px-5 py-2.5 bg-white rounded-full border border-rose-100 hover:border-rose-300 transition-colors">Studio: <b className="text-rose-500 font-bold ml-1">@rent.mila</b></span>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
};

export default AboutPage;