import React from 'react';
import { FileText, FileSpreadsheet, Eye, Pencil, CheckCircle } from 'lucide-react';

function FileCard({ file, folderType, onEdit, onApprove, onView }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between text-center transition-transform hover:scale-105 duration-200 ease-in-out border border-gray-200">
      {file.type === 'pdf' ? (
        <FileText className="w-12 h-12 text-red-500 mb-2" />
      ) : (
        <FileSpreadsheet className="w-12 h-12 text-green-600 mb-2" />
      )}
      <p className="font-semibold text-gray-800 text-sm break-all w-full">{file.name}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {folderType === 'Incoming Invoices' && (
          <>
            <button
              onClick={() => onEdit(file, 'Incoming Invoices')}
              className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors tooltip group relative"
            >
              <Pencil className="w-4 h-4" />
              <span className="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-700 rounded-md whitespace-nowrap">Edit</span>
            </button>
            <button
              onClick={() => onApprove(file.id)}
              className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 transition-colors tooltip group relative"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-700 rounded-md whitespace-nowrap">Approve</span>
            </button>
          </>
        )}
        {(folderType === 'Published Documents' || folderType === 'Incoming Invoices') && (
          <button
            onClick={() => onView(file, folderType)}
            className="bg-purple-500 text-white p-2 rounded-full shadow-md hover:bg-purple-600 transition-colors tooltip group relative"
          >
            <Eye className="w-4 h-4" />
            <span className="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-700 rounded-md whitespace-nowrap">View</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default FileCard;
