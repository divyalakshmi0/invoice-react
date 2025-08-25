import React from 'react';
import { FileText } from 'lucide-react';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoiceNumber,
  invoiceDate,
  dueDate,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
        {/* Company Info */}
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">App Logics</h1>
            <div className="text-gray-600 space-y-1">
              <p>123 Business Street, Suite 100</p>
              <p>New York, NY 10001</p>
              <p>Phone: (555) 123-4567 | Email: info@applogics.com</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-gray-50 rounded-lg p-6 min-w-[280px]">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">INVOICE</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Invoice #:</span>
              <span className="text-gray-900 font-semibold">{invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Date:</span>
              <span className="text-gray-900 font-semibold">{invoiceDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Due Date:</span>
              <span className="text-gray-900 font-semibold">{dueDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;