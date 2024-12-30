'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload,
  Activity,
  X
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  title: string;
  subtext?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, title, subtext }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200">
    <div className="text-gray-500 dark:text-gray-400 mb-2">{icon}</div>
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</h3>
        {subtext && (
          <span className="text-sm text-gray-500 dark:text-gray-400">{subtext}</span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  </div>
);

const DashboardView = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalDocuments: number;
    storageUsed: number;
    recentActivity: any[];
  }>({
    totalDocuments: 0,
    storageUsed: 0,
    recentActivity: []
  });
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Check authentication and fetch stats on component mount
  useEffect(() => {
    const checkAuthAndFetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Fetch document stats
      const { data: documents, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', session.user.id);

      if (documentsError) {
        console.error('Error fetching documents:', documentsError);
        return;
      }

      // Calculate total storage used in bytes
      const totalStorage = documents?.reduce((acc, doc) => acc + (doc.size || 0), 0) || 0;
      const storageInGB = totalStorage / (1024 * 1024 * 1024); // Convert bytes to GB

      // Fetch recent activity (last 5 documents)
      const { data: recentDocs, error: recentError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) {
        console.error('Error fetching recent activity:', recentError);
      }

      setStats({
        totalDocuments: documents?.length || 0,
        storageUsed: storageInGB,
        recentActivity: recentDocs || []
      });
    };

    checkAuthAndFetchStats();
  }, [router, supabase]);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
      }
    };
    checkAuth();
  }, [router, supabase.auth]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to upload documents');
      }

      const fileName = `${session.user.id}/${Date.now()}-${selectedFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          name: selectedFile.name,
          file_path: fileName,
          size: selectedFile.size,
          type: selectedFile.type,
          user_id: session.user.id
        });

      if (dbError) {
        await supabase.storage.from('documents').remove([fileName]);
        throw dbError;
      }

      setIsUploadModalOpen(false);
      setSelectedFile(null);
      router.refresh();
      
      // Redirect to Documents view after successful upload
      window.location.hash = '#documents';
      const documentsButton = document.querySelector('button[data-tab="documents"]');
      if (documentsButton) {
        (documentsButton as HTMLButtonElement).click();
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <button 
        onClick={() => setIsUploadModalOpen(true)}
        className="w-full flex items-center justify-center space-x-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200"
      >
        <Upload className="w-5 h-5" />
        <span>{t.dashboard.upload}</span>
      </button>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t.dashboard.documents}
          </h2>
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            value={stats.totalDocuments.toString()}
            title={t.dashboard.documents}
            subtext={`${((stats.totalDocuments / 1000) * 100).toFixed(1)}%`}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t.dashboard.storage}
          </h2>
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            value={`${stats.storageUsed.toFixed(2)} GB`}
            title={t.dashboard.storage}
            subtext={`/ 50 GB`}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t.dashboard.recentUploads}</h2>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((doc: any) => (
              <div key={doc.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                    <p className="text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{(doc.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-4 text-center">{t.dashboard.noRecentUploads}</p>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.dashboard.uploadDocument}</h2>
              <button 
                onClick={() => setIsUploadModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {selectedFile ? selectedFile.name : t.dashboard.uploadHint}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF files only</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
              
              {selectedFile && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t.dashboard.selectedFile}: {selectedFile.name}
                </p>
              )}
              
              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFile(null);
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {t.dashboard.cancel}
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile}
                  className={`px-4 py-2 bg-black dark:bg-gray-700 text-white rounded ${
                    uploading || !selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 dark:hover:bg-gray-600'
                  }`}
                >
                  {uploading ? t.dashboard.uploading : t.dashboard.upload}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
