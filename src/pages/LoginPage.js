import React from 'react';
import { LogIn } from 'lucide-react';

function LoginPage({ onLogin }) { // onLogin prop is now responsible for initiating MSAL login
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full border-t-4 border-blue-500">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome to Invoice System</h2>
        <p className="text-gray-600 mb-8">Please log in with your Microsoft account to continue.</p>
        <button
          onClick={onLogin} // This now calls handleMicrosoftLogin from App.js which uses MSAL
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
        >
          <LogIn className="w-5 h-5 mr-3" />
          Login with Microsoft
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
