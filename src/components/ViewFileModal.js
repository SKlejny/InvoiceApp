import React from 'react';
import { X } from 'lucide-react';

function ViewFileModal({ isOpen, onClose, fileName, fileContent }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Viewing: {fileName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto mb-6">
          <p className="whitespace-pre-wrap text-gray-800 text-sm">{fileContent}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewFileModal;
