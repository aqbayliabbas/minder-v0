'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6 last:border-0">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
        checked ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-1 bg-white'
      }`}
    />
  </button>
);

const SettingsView = () => {
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
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {t.navigation.theme.light || '🌞 Light'}
            </button>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-900'
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
