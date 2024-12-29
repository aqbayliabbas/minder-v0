'use client'

import { motion, useScroll, useInView } from 'framer-motion'
import { useRef } from 'react'
import Navigation from '@/components/Navigation'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/translations'
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Animation variants
const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
}

export default function Home() {
  const { language } = useLanguage()
  const t = translations[language]

  const problemRef = useRef(null)
  const solutionRef = useRef(null)
  const faqRef = useRef(null)
  const newsletterRef = useRef(null)

  const isProblemInView = useInView(problemRef, { once: true, margin: "-100px" })
  const isSolutionInView = useInView(solutionRef, { once: true, margin: "-100px" })
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" })
  const isNewsletterInView = useInView(newsletterRef, { once: true, margin: "-100px" })

  const avatars = [
    '/assets/images/avatar01.jpg',
    '/assets/images/avatar02.jpg',
    '/assets/images/avatar03.jpg',
    '/assets/images/avatar04.jpg',
    '/assets/images/avatar05.jpg'
  ]

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState({ type: '', content: '' });
  const supabase = createClientComponentClient();

  const handlePreSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const { error } = await supabase
        .from('presignup')
        .insert([{ email, phone_number: phoneNumber }]);

      if (error) throw error;

      setIsModalOpen(false);
      setEmail('');
      setPhoneNumber('');
      setIsSuccessModalOpen(true); // Show success modal
      setTimeout(() => setIsSuccessModalOpen(false), 5000); // Hide after 5 seconds
    } catch (error: any) {
      if (error.code === '23505') {
        setMessage({ type: 'error', content: 'This email is already registered for early access.' });
      } else {
        setMessage({ type: 'error', content: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterLoading(true);
    setNewsletterMessage({ type: '', content: '' });

    try {
      const { error } = await supabase
        .from('newsletter')
        .insert([{ email: newsletterEmail }]);

      if (error) throw error;

      setNewsletterMessage({ type: 'success', content: 'Thank you for subscribing!' });
      setNewsletterEmail('');
    } catch (error: any) {
      if (error.code === '23505') {
        setNewsletterMessage({ type: 'error', content: 'This email is already subscribed.' });
      } else {
        setNewsletterMessage({ type: 'error', content: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsNewsletterLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 bg-white dark:bg-zinc-900">
      <header>
        <Navigation />
      </header>

      {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        <motion.h1 
          variants={fadeInUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto leading-[1.4] mb-6 text-zinc-900 dark:text-zinc-50"
        >
          <div className="mb-4 sm:mb-6">
            {t.hero.title}
          </div>
        </motion.h1>

        <motion.p 
          variants={fadeInUp}
          className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div 
          variants={fadeInUp}
          className="flex flex-col items-center gap-6 mt-8 mb-12"
        >
          <motion.button 
            variants={fadeInUp}
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            {t.hero.cta}
          </motion.button>

          {/* User Reviews Section */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6"
          >
            {/* Avatars Group */}
            <div className="flex -space-x-3">
              {avatars.map((avatar, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, zIndex: 1 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-zinc-800 relative overflow-hidden shadow-md"
                >
                  <Image
                    src={avatar}
                    alt={`Team member ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 32px, 40px"
                  />
                </motion.div>
              ))}
            </div>

            {/* Review Text */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.svg
                    key={star}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: star * 0.1 }}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 001.707.293l5.414 5.414a1 1 0 001.293.707V19a2 2 0 01-2 2z" />
                  </motion.svg>
                ))}
              </div>
              <motion.span 
                variants={fadeInUp}
                className="text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span className="font-medium">2,157</span> {t.hero.users}
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Problem Section */}
      <section
        ref={problemRef}
        className="py-20 bg-zinc-50 dark:bg-zinc-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isProblemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-16 text-zinc-900 dark:text-zinc-50"
          >
            {t.problem.title}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isProblemInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                {t.problem.features.timeConsuming.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t.problem.features.timeConsuming.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isProblemInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                {t.problem.features.infoOverload.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t.problem.features.infoOverload.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isProblemInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                {t.problem.features.manualAnalysis.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t.problem.features.manualAnalysis.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={solutionRef}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSolutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              {t.features.title}
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
              {t.features.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSolutionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.analysis.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t.features.cards.analysis.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSolutionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.collaboration.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t.features.cards.collaboration.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSolutionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.ai.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t.features.cards.ai.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <motion.section 
        ref={solutionRef}
        className="py-16 sm:py-24"
        initial={{ opacity: 0 }}
        animate={isSolutionInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              The Smart Way to Handle Documents
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              Our AI-powered solution transforms how you work with documents, making information instantly accessible and actionable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Fast Analysis */}
            <motion.div
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.search.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {t.features.cards.search.description}
              </p>
            </motion.div>

            {/* Smart Search */}
            <motion.div
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.ai.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {t.features.cards.ai.description}
              </p>
            </motion.div>

            {/* AI Understanding */}
            <motion.div
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.ai.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {t.features.cards.ai.description}
              </p>
            </motion.div>

            {/* Multi-format Support */}
            <motion.div
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.multiFormat.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {t.features.cards.multiFormat.description}
              </p>
            </motion.div>

            {/* Secure Storage */}
            <motion.div
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.security.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {t.features.cards.security.description}
              </p>
            </motion.div>

            {/* Easy Integration */}
            <motion.div
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.integration.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {t.features.cards.integration.description}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        ref={faqRef}
        className="py-16 sm:py-24 bg-gray-50 dark:bg-zinc-800"
        initial={{ opacity: 0 }}
        animate={isFaqInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              Everything you need to know about Minder and how it works.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "What types of documents can I analyze?",
                answer: "Minder supports a wide range of formats including PDFs, Word documents, Excel spreadsheets, PowerPoint presentations, and plain text files."
              },
              {
                question: "How secure is my data?",
                answer: "We use enterprise-grade encryption and security measures. Your documents are encrypted both in transit and at rest, and we never share your data with third parties."
              },
              {
                question: "Can I try Minder before subscribing?",
                answer: "Yes! We offer a free trial that lets you experience all features with up to 50 pages of document analysis."
              },
              {
                question: "How accurate is the AI analysis?",
                answer: "Our AI model achieves over 95% accuracy in document understanding and information extraction, trained on millions of documents."
              },
              {
                question: "Do you support multiple languages?",
                answer: "Yes, Minder supports over 30 languages including English, French, Spanish, German, Chinese, and Japanese."
              }
            ].map((faq, index: number) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-zinc-700 rounded-lg p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] transition-all"
              >
                <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">{faq.question}</h3>
                <p className="text-zinc-600 dark:text-zinc-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section 
        ref={newsletterRef}
        className="py-16 sm:py-24"
        initial={{ opacity: 0 }}
        animate={isNewsletterInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-900 dark:bg-zinc-100 rounded-2xl p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-50 dark:text-zinc-900">
                Stay Updated
              </h2>
              <p className="text-zinc-300 dark:text-zinc-600 mb-8">
                Get the latest updates about new features and tips to make the most of Minder.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-zinc-800/50 dark:bg-white border border-zinc-700 dark:border-zinc-200 text-zinc-100 dark:text-zinc-900 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isNewsletterLoading}
                  className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {isNewsletterLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {newsletterMessage.type && (
                <p className={`text-sm mt-4 ${newsletterMessage.type === 'success' ? 'text-green-400 dark:text-green-600' : 'text-red-400 dark:text-red-600'}`}>
                  {newsletterMessage.content}
                </p>
              )}
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Pre-signup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              {t.modal.earlyAccess.title}
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              {t.modal.earlyAccess.subtitle}
            </p>
            <form onSubmit={handlePreSignup} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {t.modal.earlyAccess.email}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  placeholder={t.modal.earlyAccess.emailPlaceholder}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {t.modal.earlyAccess.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  placeholder={t.modal.earlyAccess.phonePlaceholder}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  {t.modal.earlyAccess.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t.modal.earlyAccess.submitting : t.modal.earlyAccess.submit}
                </button>
              </div>
              {message.type === 'success' && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-4">
                  {message.content}
                </p>
              )}
              {message.type === 'error' && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-4">
                  {message.content}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white dark:bg-zinc-800 rounded-lg p-8 max-w-md w-full relative overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                transition: { 
                  delay: 0.2,
                  times: [0, 0.6, 1],
                  duration: 0.8
                }
              }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <svg
                className="w-full h-full text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Welcome to Minder! 🎉
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                Thank you for joining our waitlist. We'll notify you as soon as we launch!
              </p>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex justify-center"
              >
                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Minder</div>
            <div className="flex gap-6 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                <span className="sr-only">X (Twitter)</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              </a>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              &copy; 2024 Minder. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
