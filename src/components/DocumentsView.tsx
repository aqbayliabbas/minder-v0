'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Trash2, Loader2, MoreVertical, MessageSquare } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import DocumentPreview from './DocumentPreview';
import DocumentChat from './DocumentChat'; // Import DocumentChat component

interface Document {
  id: string;
  name: string;
  size: number;
  created_at: string;
  file_path: string;
  type: string;
  user_id: string;
}

const DocumentsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState<{ [key: string]: boolean }>({});
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const { theme } = useTheme();
  const { t } = useLanguage();
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileName = (filePath: string) => {
    return filePath.split('/').pop() || filePath;
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Update local state
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const handlePreview = async (filePath: string, type: string, docId: string) => {
    try {
      console.log('Starting preview for:', { filePath, type });
      setError(null);
      setLoadingFiles(prev => ({ ...prev, [docId]: true }));
      setActiveDropdown(null);

      if (!filePath) {
        throw new Error('File path is missing');
      }

      console.log('Downloading file from Supabase...');
      const { data, error } = await supabase
        .storage
        .from('documents')
        .download(filePath);

      if (error) {
        console.error('Supabase storage error:', error);
        throw new Error(`Storage error: ${error.message}`);
      }

      if (!data) {
        console.error('No data received from storage');
        throw new Error('No data received from storage');
      }

      // Log file details
      console.log('File downloaded successfully:', {
        size: data.size,
        type: data.type
      });

      if (type.includes('pdf')) {
        const blob = new Blob([data], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        console.log('Created PDF blob URL:', blobUrl);
        setPreviewUrl(blobUrl);
        setSelectedDocument(documents.find(d => d.id === docId) || null);
        setIsPreviewOpen(true);
      } else if (type.includes('image')) {
        const blob = new Blob([data], { type: 'image/*' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        URL.revokeObjectURL(blobUrl);
      } else {
        const blob = new Blob([data]);
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filePath.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error('Preview error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error details:', errorMessage);
      setError(`Error accessing the file: ${errorMessage}`);
      setPreviewUrl(null);
    } finally {
      setLoadingFiles(prev => ({ ...prev, [docId]: false }));
    }
  };

  const handleChat = (document: Document) => {
    setSelectedDocument(document);
    setIsChatOpen(true);
  };

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-menu')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (docId: string) => {
    setActiveDropdown(activeDropdown === docId ? null : docId);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <DocumentPreview 
        document={selectedDocument}
        url={previewUrl}
        isOpen={isPreviewOpen}
        onClose={() => {
          if (previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
          }
          setPreviewUrl(null);
          setSelectedDocument(null);
          setIsPreviewOpen(false);
        }}
      />
      
      <DocumentChat 
        document={selectedDocument}
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedDocument(null);
        }}
      />

      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full p-2 pl-9 text-xs sm:text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-black focus:border-black"
            placeholder={t.dashboard.searchDocuments}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 sm:w-8 h-6 sm:h-8 animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 text-sm sm:text-base">{error}</div>
      ) : documents.length === 0 ? (
        <div className="text-center text-gray-500 p-4 text-sm sm:text-base">{t.dashboard.noDocumentsInitial}</div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-3">
          {documents
            .filter(doc =>
              doc.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(doc => (
              <div
                key={doc.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                    <FileText className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 text-gray-400 mt-1" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                        {getFileName(doc.file_path)}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(doc.size)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop Actions */}
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(doc.file_path, doc.type, doc.id)}
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      disabled={loadingFiles[doc.id]}
                    >
                      {loadingFiles[doc.id] ? (
                        <Loader2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-spin" />
                      ) : (
                        <FileText className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {loadingFiles[doc.id] ? 'Loading...' : t.dashboard.previewDocument}
                      </span>
                      <span className="sm:hidden">Preview</span>
                    </button>
                    <button
                      onClick={() => handleChat(doc)}
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <MessageSquare className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.file_path)}
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Mobile Actions */}
                  <div className="relative sm:hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(doc.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    {activeDropdown === doc.id && (
                      <div className="dropdown-menu absolute right-0 mt-1 w-40 sm:w-48 py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <button
                          onClick={() => handlePreview(doc.file_path, doc.type, doc.id)}
                          className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          disabled={loadingFiles[doc.id]}
                        >
                          {loadingFiles[doc.id] ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <FileText className="w-3.5 h-3.5" />
                          )}
                          {loadingFiles[doc.id] ? 'Loading...' : 'Preview'}
                        </button>
                        <button
                          onClick={() => handleChat(doc)}
                          className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.file_path)}
                          className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsView;
