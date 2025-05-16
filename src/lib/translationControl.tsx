import { useState } from 'react';
import { translations } from './translation';

export function useTranslations(defaultLang = 'english') {
  const [lang, setLang] = useState(defaultLang);
  const t = translations[lang];
  const toggle = () => setLang(lang === 'english' ? 'nepali' : 'english');
  return { t, lang, toggle };
}