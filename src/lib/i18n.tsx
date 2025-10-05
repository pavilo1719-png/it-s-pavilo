import React, { createContext, useContext, useEffect, useState } from 'react';
import en from '@/i18n/en.json';
import gu from '@/i18n/gu.json';
import hi from '@/i18n/hi.json';

type Lang = 'en'|'gu'|'hi';
const dicts: Record<Lang, Record<string,string>> = { en, gu, hi };

type I18nContextType = {
  lang: Lang;
  setLang: (l:Lang)=>void;
  t: (k:string)=>string;
  darkMode: boolean;
  setDarkMode: (b:boolean)=>void;
};

const I18nContext = createContext<I18nContextType>({ lang: 'en', setLang: ()=>{}, t: (k)=>k, darkMode:false, setDarkMode: ()=>{} });

export const I18nProvider: React.FC<{children:React.ReactNode}> = ({children})=>{
  const [lang, setLang] = useState<Lang>(()=>{
    try {
      const raw = localStorage.getItem('pavilo_app_settings');
      if (raw) {
        const s = JSON.parse(raw);
        return (s.language as Lang) || 'en';
      }
    } catch(e){ console.error(e); }
    return 'en';
  });

  const [darkMode, setDarkMode] = useState<boolean>(()=>{
    try {
      const raw = localStorage.getItem('pavilo_app_settings');
      if (raw) {
        const s = JSON.parse(raw);
        return !!s.darkMode;
      }
    } catch(e){ console.error(e); }
    return false;
  });

  useEffect(()=>{
    try {
      const raw = localStorage.getItem('pavilo_app_settings');
      const s = raw ? JSON.parse(raw) : {};
      s.language = lang;
      s.darkMode = darkMode;
      localStorage.setItem('pavilo_app_settings', JSON.stringify(s));
    } catch(e){ console.error(e); }
  }, [lang, darkMode]);

  useEffect(()=>{
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const t = (k:string)=> {
    const dict = dicts[lang] || dicts['en'];
    return dict[k] || dicts['en'][k] || k;
  };

  return <I18nContext.Provider value={{lang,setLang,t,darkMode,setDarkMode}}>{children}</I18nContext.Provider>
}

export const useI18n = ()=> useContext(I18nContext);
