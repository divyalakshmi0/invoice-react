import React, { useState } from 'react';
import HomePage from './components/HomePage';
import OwnerLogin from './components/OwnerLogin';
import OwnerDashboard from './components/OwnerDashboard';
import InvoiceGenerator from './components/InvoiceGenerator';

type AppView = 'home' | 'login' | 'dashboard' | 'invoice' | 'timesheet';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const handleOwnerLogin = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleInvoiceGenerator = () => {
    setCurrentView('invoice');
  };

  const handleTimesheetDownload = async () => {
    try {
      // Download timesheet Excel file
      const response = await fetch("https://b86389ed-4c01-4b96-b966-7eb99b586dd6-00-3qsfgfmccjso.sisko.replit.dev/api/v1.0/download/time-sheet", {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to download timesheet");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "timesheets.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      notification.textContent = 'Timesheet downloaded successfully!';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);

    } catch (error) {
      console.error('Error downloading timesheet:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      notification.textContent = 'Error downloading timesheet. Please try again.';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onOwnerLogin={handleOwnerLogin} />;
      case 'login':
        return (
          <OwnerLogin
            onBack={handleBackToHome}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'dashboard':
        return (
          <OwnerDashboard
            onBack={handleBackToHome}
            onInvoiceGenerator={handleInvoiceGenerator}
            onTimesheetDownload={handleTimesheetDownload}
          />
        );
      case 'invoice':
        return <InvoiceGenerator onBack={handleBackToDashboard} />;
      default:
        return <HomePage onOwnerLogin={handleOwnerLogin} />;
    }
  };

  return <>{renderCurrentView()}</>;
}

export default App;