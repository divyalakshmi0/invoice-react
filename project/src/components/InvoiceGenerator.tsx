import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, X, Eye } from 'lucide-react';

interface UploadedFile {
  id: number;
  file: File;
  name: string;
  size: number;
  progress: number;
  isComplete: boolean;
}

const InvoiceGenerator: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      showNotification('Please upload only Excel files (.xlsx, .xls)', 'error');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      showNotification('File size must be less than 10MB', 'error');
      return false;
    }
    
    return true;
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const handleFileUpload = (files: FileList) => {
    const file = files[0];
    if (!validateFile(file)) return;

    const fileObj: UploadedFile = {
      id: Date.now(),
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      isComplete: false,
    };

    setUploadedFile(fileObj);
    simulateUpload(fileObj);
  };

  const simulateUpload = (fileObj: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFile(prev => prev ? { ...prev, progress: 100, isComplete: true } : null);
        showNotification('File uploaded successfully!', 'success');
      } else {
        setUploadedFile(prev => prev ? { ...prev, progress } : null);
      }
    }, 150);
  };

  const handleDownloadInvoice = async () => {
    if (!uploadedFile || !uploadedFile.isComplete) {
      showNotification('Please upload a file first', 'error');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", uploadedFile.file);

    try {
      const res = await fetch("https://b86389ed-4c01-4b96-b966-7eb99b586dd6-00-3qsfgfmccjso.sisko.replit.dev/api/v1.0/invoice", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to generate invoice");
      const blob = await res.blob();

      const contentDisposition = res.headers.get("Content-Disposition");
      let fileName = "invoice.pdf";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        fileName = contentDisposition
          .split("filename=")[1]
          .replace(/["']/g, "")
          .trim();
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification('Invoice downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Error generating invoice. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
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
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const viewFile = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile.file);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-6">
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Generator</h1>
          <p className="text-gray-600">Upload Excel file and generate PDF invoice</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Upload className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Upload File</h2>
              </div>

              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`p-3 rounded-full ${
                      isDragOver ? 'bg-blue-200' : 'bg-gray-100'
                    }`}>
                      <Upload className={`w-6 h-6 ${
                        isDragOver ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        Drop Excel file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">Supports .xlsx and .xls files (max 10MB)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={viewFile}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View file"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={removeFile}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {!uploadedFile.isComplete && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Uploading...</span>
                        <span className="text-gray-600">{Math.round(uploadedFile.progress)}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {uploadedFile.isComplete && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Upload complete</span>
                    </div>
                  )}
                </div>
              )}

              <input
                id="fileInput"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Download Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Download className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Generate Invoice</h2>
              </div>

              <div className="space-y-6">
                {uploadedFile?.isComplete ? (
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Ready to Generate</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Your Excel file is ready to be processed into a PDF invoice.
                    </p>
                    
                    <button
                      onClick={handleDownloadInvoice}
                      disabled={isProcessing}
                      className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        !isProcessing
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-3" />
                          Download PDF Invoice
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-amber-600 mr-3" />
                      <p className="text-amber-800">
                        Please upload an Excel file to generate invoice.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;