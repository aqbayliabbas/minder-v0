"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline } from 'react-icons/io5';

const UploadModal: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    // Handle file upload logic here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Upload PDF</h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-black bg-gray-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <IoCloudUploadOutline size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">
          {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
        </p>
        <p className="text-sm text-gray-500">or</p>
        <button className="mt-2 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90">
          Browse Files
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Selected Files:</h3>
          {files.map((file, index) => (
            <div key={index} className="text-sm text-gray-600">
              {file.name}
            </div>
          ))}
          <button 
            className="w-full mt-4 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90"
            onClick={() => {
              console.log('Uploading files:', files);
            }}
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadModal;
