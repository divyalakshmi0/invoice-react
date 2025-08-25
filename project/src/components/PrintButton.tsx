import React from 'react';
import { Printer } from 'lucide-react';

const PrintButton: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="fixed top-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-2 z-10 print:hidden"
    >
      <Printer className="w-5 h-5" />
      <span className="font-medium">Print Invoice</span>
    </button>
  );
};

export default PrintButton;