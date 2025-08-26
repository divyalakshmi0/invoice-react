import React from 'react';
import { FileSpreadsheet, Download, ArrowLeft, Clock, BarChart3 } from 'lucide-react';

interface OwnerDashboardProps {
  onBack: () => void;
  onInvoiceGenerator: () => void;
  onTimesheetDownload: () => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onBack,
  onInvoiceGenerator,
  onTimesheetDownload
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
                  <p className="text-gray-600">Manage invoices and timesheets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back!</h2>
          <p className="text-gray-600 text-lg">Choose an action to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Invoice Generator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Invoice Generator</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Upload Excel files and generate professional PDF invoices for your clients. 
                Streamline your billing process with automated invoice creation.
              </p>
              <button
                onClick={onInvoiceGenerator}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Generate Invoices
              </button>
            </div>
          </div>

          {/* Timesheet Download Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download Timesheets</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Access and download employee timesheet data. Export comprehensive reports 
                for payroll processing and project management.
              </p>
              <button
                onClick={onTimesheetDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <Download className="w-5 h-5 inline mr-3" />
                Download Timesheets
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
            <div className="text-gray-600">Invoices This Month</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">156</div>
            <div className="text-gray-600">Hours Logged</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">8</div>
            <div className="text-gray-600">Active Projects</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;