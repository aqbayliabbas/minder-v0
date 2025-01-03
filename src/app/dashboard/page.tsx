'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut } from 'lucide-react';

// Dynamically import components with SSR disabled
const DynamicDashboardView = dynamic(() => import('../../components/DashboardView'), { ssr: false });
const DynamicDocumentsView = dynamic(() => import('../../components/DocumentsView'), { ssr: false });
const DynamicSettingsView = dynamic(() => import('../../components/SettingsView'), { ssr: false });

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200`}>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-expanded={isSidebarOpen}
                aria-controls="sidebar"
                aria-label="Toggle sidebar"
              >
                <span className="sr-only">Toggle sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
              <Image
                src="/assets/images/minder-logoo.png"
                alt="Minder Logo"
                width={24}
                height={24}
                className="self-center ml-2 mr-2"
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-gray-900 dark:text-white">
                {t.dashboard.logo}
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="px-2 md:px-3 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {t.navigation.language[language === 'en' ? 'fr' : 'en']}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-500 dark:text-gray-400" />
                ) : (
                  <MoonIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">{loading ? 'Signing out...' : t.dashboard.signOut}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside 
        id="sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`flex items-center w-full p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors ${
                  activeTab === 'dashboard' ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                {t.dashboard.welcome}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick('documents')}
                className={`flex items-center w-full p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors ${
                  activeTab === 'documents' ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                {t.dashboard.documents}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick('settings')}
                className={`flex items-center w-full p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors ${
                  activeTab === 'settings' ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                {t.dashboard.settings}
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="p-4 md:ml-64 pt-20">
        {activeTab === 'dashboard' && <DynamicDashboardView />}
        {activeTab === 'documents' && <DynamicDocumentsView />}
        {activeTab === 'settings' && <DynamicSettingsView />}
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

// Export the component with SSR disabled
export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false });
