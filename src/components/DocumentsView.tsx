'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Trash2, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

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

  const handlePreview = async (filePath: string, type: string) => {
    try {
      const { data } = await supabase
        .storage
        .from('documents')
        .getPublicUrl(filePath);

      // For PDFs and images, open in new tab
      if (type.includes('pdf') || type.includes('image')) {
        window.open(data.publicUrl, '_blank');
      } else {
        // For other files, download them
        const response = await fetch(data.publicUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error previewing document:', err);
      setError(err instanceof Error ? err.message : 'Failed to preview document');
    }
  };

  const handleChat = (id: string) => {
    console.log('Chat button clicked with id:', id);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {t.dashboard.documents}
        </h2>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder={t.dashboard.searchDocuments}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            {t.dashboard.loadingDocuments}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? t.dashboard.noDocumentsFound : t.dashboard.noDocumentsInitial}
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{getFileName(doc.name)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400">{formatFileSize(doc.size)}</span>
                <span className="text-gray-500 dark:text-gray-400">{formatDate(doc.created_at)}</span>
                <button
                  onClick={() => handlePreview(doc.file_path, doc.type)}
                  className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {t.dashboard.previewDocument}
                </button>
                <button
                  onClick={() => handleChat(doc.id)}
                  className="px-3 py-1 text-sm rounded-md bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Chat
                </button>
                <button
                  onClick={() => handleDelete(doc.id, doc.file_path)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title={t.dashboard.deleteDocument}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentsView;
