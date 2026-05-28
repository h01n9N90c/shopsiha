import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { lang, toggleLang } = useLanguage();
  return (
    <button 
      onClick={toggleLang}
      className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors"
    >
      {lang === 'vi' ? 'EN' : 'VI'}
    </button>
  );
};
