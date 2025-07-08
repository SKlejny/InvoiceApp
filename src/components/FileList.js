// src/components/FileList.js

import React from 'react';
import FileCard from './FileCard'; // Assuming FileCard is in the same directory and is already styled

// This component is responsible for rendering a list of files in a grid format.
// It expects to receive an array of 'files' that are already filtered and sorted
// by its parent component (e.g., SentDocumentsPage).
const FileList = ({ files, onView, onEdit, onApprove, onSent, showApprove, showSent, isViewAndEdit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
      {files.map((file) => (
        // Render each file using the FileCard component.
        // Pass through all necessary props that FileCard might need for its functionality
        // (view, edit, approve, sent actions, and flags for showing specific buttons).
        <FileCard
          key={file.id}
          file={file}
          onView={onView}
          onEdit={onEdit} // Pass if FileCard needs it (e.g., for XLSX view/edit)
          onApprove={onApprove} // Pass if FileCard needs it (e.g., IncomingPage)
          onSent={onSent} // Pass if FileCard needs it (e.g., PublishedPage)
          showApprove={showApprove} // Control button visibility
          showSent={showSent}       // Control button visibility
          isViewAndEdit={isViewAndEdit} // Control button text/logic
        />
      ))}
    </div>
  );
};

export default FileList;