import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const [messages, setMessages] = useState<{sender: 'user' | 'agent', text: string}[]>([
    { sender: 'agent', text: 'Xin chào nàng! Chúng mình có thể giúp gì cho nàng hôm nay?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'agent', text: 'Cảm ơn nàng 💕. Chuyên viên tư vấn sẽ phản hồi lại ngay nhé!' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-rose-400 text-white p-4 rounded-full shadow-lg shadow-pink-500/30 hover:scale-105 hover:shadow-xl transition-all"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[340px] h-[450px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-pink-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-l from-pink-400 to-rose-400 text-white p-5 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full mix-blend-overlay blur-xl"></div>
            <span className="font-semibold text-lg flex items-center gap-2"><Sparkles size={18}/> {t('chat')} SI HA</span>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white bg-white/20 p-1.5 rounded-full backdrop-blur-sm transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-pink-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${m.sender === 'user' ? 'bg-pink-500 text-white self-end rounded-tr-sm' : 'bg-white border border-pink-100 text-zinc-700 self-start rounded-tl-sm'}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-pink-50 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 outline-none text-sm px-4 py-3 bg-pink-50/50 border border-pink-100 focus:border-pink-300 rounded-xl transition-colors"
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSend} className="bg-emerald-400 text-white p-3 rounded-xl hover:bg-emerald-500 shadow-md shadow-emerald-400/20 transition-all active:scale-95">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
