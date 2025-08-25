import React, { useState, useRef } from 'react';
import { Upload, Eye, Trash2, FileText, File } from 'lucide-react';

interface UploadedFile {
  id: number;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  isComplete: boolean;
}

interface FileUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['.pdf', '.xlsx', '.xls'];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const showError = (message: string) => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const validateFile = (file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      showError('File type not supported. Please upload PDF or Excel files only.');
      return false;
    }
    
    if (file.size > maxFileSize) {
      showError('File size too large. Maximum size is 10MB.');
      return false;
    }
    
    if (uploadedFiles.some(f => f.name === file.name)) {
      showError(`File "${file.name}" already exists.`);
      return false;
    }
    
    return true;
  };

  const simulateUpload = (fileObj: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, progress: 100, isComplete: true }
              : f
          )
        );
      } else {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, progress }
              : f
          )
        );
      }
    }, 200);
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        const fileId = Date.now() + Math.random();
        const fileObj: UploadedFile = {
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          isComplete: false,
        };

        setUploadedFiles(prev => {
          const newFiles = [...prev, fileObj];
          onFilesChange?.(newFiles);
          return newFiles;
        });
        
        simulateUpload(fileObj);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const viewFile = (fileObj: UploadedFile) => {
    const url = URL.createObjectURL(fileObj.file);
    window.open(url, '_blank');
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      onFilesChange?.(newFiles);
      return newFiles;
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? FileText : File;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Documents</h3>
        <p className="text-gray-600">Upload PDF or Excel files related to this invoice</p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-3 rounded-full transition-colors ${
            isDragOver ? 'bg-indigo-200' : 'bg-gray-200'
          }`}>
            <Upload className={`w-8 h-8 transition-colors ${
              isDragOver ? 'text-indigo-600' : 'text-gray-500'
            }`} />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              Drag & drop files here or <span className="text-indigo-600 hover:text-indigo-700">browse</span>
            </p>
            <p className="text-sm text-gray-500">Supports PDF and Excel files (max 10MB each)</p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.xlsx,.xls"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files</h4>
          {uploadedFiles.map((fileObj) => {
            const FileIcon = getFileIcon(fileObj.name);
            const isPDF = fileObj.name.toLowerCase().endsWith('.pdf');
            
            return (
              <div
                key={fileObj.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  fileObj.isComplete
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      isPDF ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <FileIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileObj.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileObj.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewFile(fileObj)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View file"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {!fileObj.isComplete && (
                  <div className="mt-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileObj.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;