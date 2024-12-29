'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import Image from 'next/image'
import { motion } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import { useState } from 'react'

export default function Navigation() {
  const { language, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/minder-logoo.png"
                alt="Minder Logo"
                width={24}
                height={24}
                className="self-center mr-2"
              />
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Minder
              </span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-md border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              {theme === 'dark' ? (
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  <span className="hidden sm:inline">{t.navigation.theme.light}</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                  <span className="hidden sm:inline">{t.navigation.theme.dark}</span>
                </span>
              )}
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/auth/login"
                className="px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {language === 'fr' ? 'Connexion' : 'Sign In'}
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/auth/signup"
                className="px-4 py-2 rounded-md bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                {language === 'fr' ? 'Inscription' : 'Sign Up'}
              </motion.a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div 
          className={`${isOpen ? 'block' : 'hidden'} md:hidden`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="flex flex-col gap-4 items-center">
              <LanguageSwitcher />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="w-full p-2 rounded-md border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                {theme === 'dark' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                    {t.navigation.theme.light}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                    {t.navigation.theme.dark}
                  </span>
                )}
              </motion.button>

              <div className="flex flex-col w-full gap-2">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/auth/login"
                  className="w-full px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-center"
                >
                  {language === 'fr' ? 'Connexion' : 'Sign In'}
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/auth/signup"
                  className="w-full px-4 py-2 rounded-md bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-center"
                >
                  {language === 'fr' ? 'Inscription' : 'Sign Up'}
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}
