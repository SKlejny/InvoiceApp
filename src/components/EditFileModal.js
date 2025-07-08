// src/components/EditFileModal.js

import React from 'react';
import { X } from 'lucide-react'; // Import X icon specifically for this component

const EditFileModal = ({ isOpen, onClose, fileName, onFileNameChange, fileContent, onFileContentChange, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit File</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="fileName" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">File Name:</label>
          <input
            type="text"
            id="fileName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            value={fileName}
            onChange={onFileNameChange}
            aria-label="File Name"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="fileContent" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">File Content (Simulated):</label>
          <textarea
            id="fileContent"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-32 resize-y dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            value={fileContent}
            onChange={onFileContentChange}
            aria-label="File Content"
          ></textarea>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition-colors shadow-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFileModal;