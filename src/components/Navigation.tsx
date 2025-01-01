'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const { language } = useLanguage()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
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
                priority
              />
              <span className="text-xl sm:text-2xl font-bold text-zinc-900">
                Minder
              </span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-700 hover:bg-zinc-50 transition-colors"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              <motion.div
                animate={isOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 90 },
                  closed: { rotate: 0 }
                }}
                transition={{ duration: 0.2 }}
              >
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pointer-events-none opacity-50 px-4 py-2 rounded-md border border-zinc-200 text-zinc-900 text-sm font-medium hover:bg-zinc-50 transition-colors"
              >
                {language === 'fr' ? 'Connexion' : 'Sign In'}
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pointer-events-none opacity-50 px-4 py-2 rounded-md bg-zinc-900 text-zinc-50 text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                {language === 'fr' ? 'Inscription' : 'Sign Up'}
              </motion.a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white border-b border-zinc-100"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="flex flex-col gap-4 items-center">
                  <div className="flex flex-col w-full gap-2">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pointer-events-none opacity-50 w-full px-4 py-2 rounded-md border border-zinc-200 text-zinc-900 text-sm font-medium hover:bg-zinc-50 transition-colors text-center"
                    >
                      {language === 'fr' ? 'Connexion' : 'Sign In'}
                    </motion.a>

                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pointer-events-none opacity-50 w-full px-4 py-2 rounded-md bg-zinc-900 text-zinc-50 text-sm font-medium hover:bg-zinc-800 transition-colors text-center"
                    >
                      {language === 'fr' ? 'Inscription' : 'Sign Up'}
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
