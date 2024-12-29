'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import DashboardView from '../../components/DashboardView';
import DocumentsView from '../../components/DocumentsView';
import SettingsView from '../../components/SettingsView';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut } from 'lucide-react';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200`}>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/assets/images/minder-logoo.png"
                alt="Minder Logo"
                width={24}
                height={24}
                className="self-center mr-2"
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-gray-900 dark:text-white">
                {t.dashboard.logo}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="px-3 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {t.navigation.language[language === 'en' ? 'fr' : 'en']}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                <LogOut className="w-4 h-4" />
                {loading ? 'Signing out...' : t.dashboard.signOut}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center w-full p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeTab === 'dashboard' ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                {t.dashboard.welcome}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center w-full p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeTab === 'documents' ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                {t.dashboard.documents}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center w-full p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeTab === 'settings' ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                {t.dashboard.settings}
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="p-4 sm:ml-64 pt-20">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'documents' && <DocumentsView />}
        {activeTab === 'settings' && <SettingsView />}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
};

export default DashboardPage;