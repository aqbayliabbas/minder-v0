'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
        }`}
      >
        {t.navigation.language.en}
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'fr'
            ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
        }`}
      >
        {t.navigation.language.fr}
      </button>
    </div>
  );
}
