import React from 'react';
import { X } from 'lucide-react';

function EditFileModal({ isOpen, onClose, fileName, onFileNameChange, fileContent, onFileContentChange, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit File</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="fileName" className="block text-gray-700 text-sm font-bold mb-2">File Name:</label>
          <input
            type="text"
            id="fileName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            value={fileName}
            onChange={onFileNameChange}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="fileContent" className="block text-gray-700 text-sm font-bold mb-2">File Content (Simulated):</label>
          <textarea
            id="fileContent"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-32"
            value={fileContent}
            onChange={onFileContentChange}
          ></textarea>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition-colors shadow-md"
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
}

export default EditFileModal;
