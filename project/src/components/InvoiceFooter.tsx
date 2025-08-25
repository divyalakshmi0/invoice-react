import React from 'react';

const InvoiceFooter: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions:</h4>
          <p className="text-gray-600 leading-relaxed">
            Payment is due within 30 days of invoice date. Late payments may incur additional charges. 
            All work is guaranteed for 90 days from completion date.
          </p>
        </div>
        
        <div className="border-t pt-6">
          <div className="text-center">
            <p className="text-xl font-medium text-indigo-600 mb-2">Thank you for your business!</p>
            <p className="text-gray-500">We appreciate the opportunity to serve you.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;