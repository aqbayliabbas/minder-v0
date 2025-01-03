'use client'

import { X, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Document {
  id: string
  name: string
  file_path: string
  type: string
  size: number
  created_at: string
  user_id: string
}

interface DocumentPreviewProps {
  document: Document | null
  onClose: () => void
  isOpen: boolean
  url: string | null
}

export default function DocumentPreview({ document, onClose, isOpen, url }: DocumentPreviewProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getSignedUrl = async () => {
      if (!document?.file_path) return

      try {
        const { data, error } = await supabase
          .storage
          .from('documents')
          .createSignedUrl(document.file_path, 60) // URL valid for 60 seconds

        if (error) throw error
        if (data?.signedUrl) {
          setSignedUrl(data.signedUrl)
        }
      } catch (error) {
        console.error('Error getting signed URL:', error)
      }
    }

    getSignedUrl()

    // Refresh the signed URL every 45 seconds to ensure continuous access
    const interval = setInterval(getSignedUrl, 45000)
    return () => clearInterval(interval)
  }, [document, supabase])

  const containerVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25 } },
    exit: { x: '100%', opacity: 0 }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
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
            aria-label="Close preview"
          >
            <X className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>

        {/* Document Preview */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {signedUrl ? (
            <div style={{ height: '100%' }}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={signedUrl}
                  plugins={[defaultLayoutPluginInstance]}
                  defaultScale={1}
                />
              </Worker>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base p-4 text-center">
              Loading preview...
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
