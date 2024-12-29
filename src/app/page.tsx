'use client'

import { motion, useScroll, useInView } from 'framer-motion'
import { useRef } from 'react'
import Navigation from '@/components/Navigation'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/translations'

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
          className="flex flex-col items-center gap-6"
        >
          <motion.a 
            variants={fadeInUp}
            href="#"
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            {t.hero.cta}
          </motion.a>

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
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                {t.features.cards.analysis.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t.features.cards.analysis.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSolutionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                {t.features.cards.collaboration.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t.features.cards.collaboration.description}
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
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">Lightning-Fast Analysis</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Process and analyze documents in seconds instead of hours. Get instant insights from any type of document.
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
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">Smart Search</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Ask questions in natural language and get precise answers instantly from your documents.
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
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">AI Understanding</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Advanced AI comprehends context and nuances, providing deeper insights than traditional search.
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
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">Multi-format Support</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Works with PDFs, Word docs, spreadsheets, and more. No need to convert files.
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
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">Secure Storage</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Enterprise-grade security ensures your documents are safe and private at all times.
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
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">Easy Integration</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Seamlessly integrates with your existing workflow and favorite tools.
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
            ].map((faq, index) => (
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
              <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-zinc-800/50 dark:bg-white border border-zinc-700 dark:border-zinc-200 text-zinc-100 dark:text-zinc-900 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2 lg:col-span-2">
              <div className="text-2xl font-bold mb-4">Minder</div>
              <p className="text-zinc-600 dark:text-zinc-300 mb-4 max-w-sm">
                Making document understanding faster and more efficient with AI.
              </p>
              <div className="flex gap-4">
                {/* Social Media Icons */}
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <a
                    key={social}
                    href={`https://${social}.com`}
                    className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-current rounded shadow-sm hover:shadow-md transition-all" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Use Cases', 'Updates'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                {['Documentation', 'Help Center', 'API', 'Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-zinc-600 dark:text-zinc-300 text-sm">
                &copy; {new Date().getFullYear()} Minder. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
