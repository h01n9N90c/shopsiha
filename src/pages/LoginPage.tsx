import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Store, ShieldCheck, Mail, Lock, Heart, User as UserIcon } from 'lucide-react';
import { AboutPage } from './AboutPage';

export const LoginPage: React.FC = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     try {
       if (isLoginTab) {
         await login(email, password);
       } else {
         if (!name.trim()) {
           setError('Vui lòng nhập tên của bạn');
           return;
         }
         await register(email, name);
       }
       navigate('/');
     } catch (err: any) {
       setError(err.message || 'Xác thực thất bại. Vui lòng thử lại!');
     }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_8px_40px_rgba(244,114,182,0.15)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 relative z-10">
        <div className="bg-gradient-to-tr from-pink-400 to-rose-400 px-8 py-10 text-white text-center">
          <div className="inline-flex max-w-max p-4 bg-white/20 rounded-3xl mb-4 backdrop-blur-md shadow-inner border border-white/30">
             <Heart size={36} className="text-white fill-white/50"/>
          </div>
          <h2 className="text-3xl font-bold tracking-tight font-serif">Shop SI HA</h2>
          <p className="text-white/80 mt-2 text-sm font-medium">Bí mật kiêu sa của phái đẹp</p>
        </div>

        <div className="px-8 py-10">
          <div className="flex bg-pink-50/50 p-1.5 rounded-2xl mb-8 border border-pink-100">
            <button 
               onClick={() => setIsLoginTab(true)}
               className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${isLoginTab ? 'bg-white text-pink-600 shadow-sm border border-pink-100' : 'text-zinc-500 hover:text-pink-500'}`}
            >
               Đăng Nhập
            </button>
            <button 
               onClick={() => setIsLoginTab(false)}
               className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${!isLoginTab ? 'bg-white text-pink-600 shadow-sm border border-pink-100' : 'text-zinc-500 hover:text-pink-500'}`}
            >
               Đăng Ký
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="p-4 bg-pink-50 text-pink-700 text-sm rounded-xl border border-pink-200 font-medium text-center">
                 {error}
              </div>
            )}
            {!isLoginTab && (
              <div>
                 <label className="block text-sm font-semibold text-zinc-700 mb-2">Tên của bạn</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon size={18} className="text-pink-300"/>
                   </div>
                   <input 
                     type="text" 
                     required
                     value={name}
                     onChange={e => setName(e.target.value)}
                     className="block w-full pl-11 pr-4 py-3.5 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all bg-zinc-50/50 hover:bg-white focus:bg-white text-sm outline-none" 
                     placeholder="Nguyễn Hồng Nhung"
                   />
                 </div>
              </div>
            )}
            <div>
               <label className="block text-sm font-semibold text-zinc-700 mb-2">Email của bạn</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-pink-300"/>
                 </div>
                 <input 
                   type="email" 
                   required
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="block w-full pl-11 pr-4 py-3.5 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all bg-zinc-50/50 hover:bg-white focus:bg-white text-sm outline-none" 
                   placeholder="admin@s.com"
                 />
               </div>
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-zinc-700 mb-2">Mật khẩu</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-pink-300"/>
                 </div>
                 <input 
                   type="password" 
                   required
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="block w-full pl-11 pr-4 py-3.5 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all bg-zinc-50/50 hover:bg-white focus:bg-white text-sm outline-none" 
                   placeholder="••••••••"
                 />
               </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-pink-500/30 text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 disabled:from-zinc-300 disabled:to-zinc-300 transition-all active:scale-[0.98]"
            >
              {isLoading ? 'Đang xử lý...' : (isLoginTab ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản Mới')}
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-zinc-400 font-medium bg-pink-50/50 py-3 rounded-xl">
             Tài khoản mẫu: <b className="text-pink-500">admin@s.com</b> hoặc <b className="text-pink-500">user@s.com</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;