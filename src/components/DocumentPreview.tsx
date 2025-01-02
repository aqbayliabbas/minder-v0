'use client'

import { X, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
          {url ? (
            <object
              data={url}
              type="application/pdf"
              className="w-full h-full"
            >
              <p>PDF cannot be displayed. <a href={url} download>Download Instead</a></p>
            </object>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base p-4 text-center">
              Preview not available
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
