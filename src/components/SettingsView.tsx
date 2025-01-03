'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const SettingsView: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        {t.dashboard.settings}
      </h1>

      <div className="space-y-6">
        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
            {t.settings.language}
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'en'
                  ? 'bg-gray-900 text-white dark:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-100'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'fr'
                  ? 'bg-gray-900 text-white dark:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-100'
              }`}
            >
              Français
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
            {t.settings.theme}
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-gray-900 text-white dark:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-100'
              }`}
            >
              {t.navigation.theme.light || '🌞 Light'}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-900 text-white dark:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-100'
              }`}
            >
              {t.navigation.theme.dark || '🌙 Dark'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
