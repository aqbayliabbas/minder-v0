'use client';

import { useState, useRef, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { X, FileText, Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Document {
  id: string
  name: string
  file_path: string
  type: string
  size: number
  created_at: string
  user_id: string
}

interface DocumentChatProps {
  document: Document | null
  onClose: () => void
  isOpen: boolean
}

export default function DocumentChat({ document, onClose, isOpen }: DocumentChatProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const loadDocument = useCallback(async () => {
    if (!document?.file_path) return

    try {
      const { data: { signedUrl }, error } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(document.file_path, 60)

      if (error) throw error
      if (signedUrl) {
        setPdfUrl(signedUrl)
      }
    } catch (error) {
      console.error('Error getting signed URL:', error)
    }
  }, [document, supabase])

  useEffect(() => {
    if (document && document.file_path) {
      loadDocument()
    }

    // Refresh the signed URL every 45 seconds
    const interval = setInterval(() => {
      if (document && document.file_path) {
        loadDocument()
      }
    }, 45000)

    return () => clearInterval(interval)
  }, [document, loadDocument])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000))
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated AI response. Integration with your AI service will go here.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }

    // Scroll to bottom after new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const containerVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25 } },
    exit: { x: '100%', opacity: 0 }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="fixed inset-0 bg-white z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText className="w-4 sm:w-5 h-4 sm:h-5 shrink-0 text-blue-600" />
              <h2 className="font-semibold text-sm sm:text-base truncate">
                {document?.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              aria-label="Close chat"
            >
              <X className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Document Preview */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0">
              <div className="p-3 sm:p-4 border-b bg-gray-50">
                <h3 className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="w-4 h-4" />
                  Document Preview
                </h3>
              </div>
              <div className="flex-1 overflow-auto bg-gray-50">
                <div className="flex-1 bg-gray-50 overflow-hidden">
                  {pdfUrl ? (
                    <div style={{ height: '100%' }}>
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                          fileUrl={pdfUrl}
                          plugins={[defaultLayoutPluginInstance]}
                          defaultScale={1}
                        />
                      </Worker>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                      Loading preview...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="w-full md:w-1/2 flex flex-col flex-1 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-auto p-3 sm:p-4" ref={chatContainerRef}>
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-2 sm:p-3 text-sm sm:text-base ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                        <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-2 sm:p-4 border-t bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
