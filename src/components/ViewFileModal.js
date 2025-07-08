// src/components/ViewFileModal.js
import React from 'react';
import { X } from 'lucide-react';

const ViewFileModal = ({ isOpen, onClose, file, content }) => {
  if (!isOpen || !file) return null;

  const renderContent = () => {
    if (!content) {
      return <p className="text-text-secondary-dark">No content to display.</p>;
    }

    // Use an iframe for PDF files
    if (file.type === 'pdf') {
      return (
        <iframe
          src={content}
          title={file.name}
          className="w-full h-full border-none"
          aria-label={`PDF viewer for ${file.name}`}
        />
      );
    }
    
    // For any other file type, display a message as they aren't supported for viewing
    return (
        <div className="text-center p-4">
            <p className="font-semibold text-text-primary-dark">Preview not available.</p>
            <p className="text-text-secondary-dark mt-1">This file type ({file.type}) cannot be viewed directly in the app.</p>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-bg-card rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col p-4 sm:p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-text-primary-dark truncate pr-4">
            Viewing: {file.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-text-secondary-dark hover:bg-white/10 hover:text-text-primary-dark transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="flex-grow bg-black/30 rounded-lg overflow-hidden flex items-center justify-center">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ViewFileModal;