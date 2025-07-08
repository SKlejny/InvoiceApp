import React from 'react';
import { LayoutDashboard, ListTodo, FileBarChart, LogIn } from 'lucide-react';

function DashboardPage({ userProfile, folders, setCurrentPage, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 border-t-4 border-teal-500">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-teal-600" /> Dashboard
        </h2>
        {userProfile && (
          <p className="text-center text-gray-600 mb-8">
            Welcome, <span className="font-semibold text-teal-700">{userProfile.name || userProfile.email}</span>!
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setCurrentPage('incomingInvoices')}
            className="flex flex-col items-center justify-center p-6 bg-blue-100 text-blue-800 rounded-lg shadow-md hover:bg-blue-200 transition-colors duration-200 transform hover:scale-105"
          >
            <ListTodo className="w-12 h-12 mb-3" />
            <span className="font-semibold text-lg">Current Invoices (To Approve)</span>
            <span className="text-sm mt-1">{folders['Incoming Invoices'].length} files</span>
          </button>
          <button
            onClick={() => setCurrentPage('publishedDocuments')}
            className="flex flex-col items-center justify-center p-6 bg-purple-100 text-purple-800 rounded-lg shadow-md hover:bg-purple-200 transition-colors duration-200 transform hover:scale-105"
          >
            <FileBarChart className="w-12 h-12 mb-3" />
            <span className="font-semibold text-lg">Published Documents (Viewable)</span>
            <span className="text-sm mt-1">{folders['Published Documents'].length} files</span>
          </button>
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={onLogout} // Call the onLogout prop passed from App.js
            className="text-red-500 hover:text-red-700 font-semibold flex items-center mx-auto transition-colors"
          >
            <LogIn className="w-5 h-5 rotate-180 mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
