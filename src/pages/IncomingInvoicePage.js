import React from 'react';
import { FolderOpen } from 'lucide-react';
import FileCard from '../components/FileCard'; // Import FileCard component

function IncomingInvoicesPage({ files, setCurrentPage, onEdit, onApprove, onView }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 font-sans antialiased">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-6 border-t-4 border-blue-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-700 flex items-center gap-3">
            <FolderOpen className="w-8 h-8 text-blue-500" /> Current Invoices (To Approve)
          </h2>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors shadow-sm"
          >
            Back to Dashboard
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Here you can view, edit the name and content of XLSX files, and approve them to move to the "Approved Invoices" folder.
        </p>
        {files.length === 0 ? (
          <p className="text-gray-500 text-lg text-center py-8">No incoming invoices to display.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map(file => (
              <FileCard
                key={file.id}
                file={file}
                folderType="Incoming Invoices"
                onEdit={onEdit}
                onApprove={onApprove}
                onView={onView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IncomingInvoicesPage;
