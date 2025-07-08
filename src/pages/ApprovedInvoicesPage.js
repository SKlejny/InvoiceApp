// src/pages/ApprovedInvoicesPage.js

import React, { useState, useMemo } from 'react'; // Import useState and useMemo
import { LayoutDashboard, Eye, FileText, FileSpreadsheet, Search, ListFilter } from 'lucide-react'; // Import new icons

const ApprovedInvoicesPage = ({ files = [], setCurrentPage, onView }) => {
  // NEW: State for search and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('newest'); // 'newest', 'oldest', 'name-asc', 'name-desc'

  // NEW: Filter and sort files based on state
  const filteredAndSortedFiles = useMemo(() => {
    let currentFiles = [...files]; // Create a mutable copy

    // 1. Filtering
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiles = currentFiles.filter(
        (file) =>
          file.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          file.type.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // 2. Sorting
    currentFiles.sort((a, b) => {
      // Assuming 'id' can be used as a proxy for creation order if no 'createdDate' is available
      // For Approved invoices, a 'dateApproved' property would be ideal for sorting by approval date.
      // For now, using 'id' as a stable sort key if no date property exists.
      switch (sortCriteria) {
        case 'oldest':
          return a.id.localeCompare(b.id);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return b.id.localeCompare(a.id); // Default to newest based on ID
      }
    });

    return currentFiles;
  }, [files, searchTerm, sortCriteria]);

  // FileCard component definition (nested, identical to IncomingInvoicesPage's FileCard)
  const FileCard = ({ file, onView }) => ( 
    <div 
      className="bg-light-bg-card bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl 
                 p-6 flex flex-col items-center text-center transition-transform hover:scale-105 duration-200 
                 h-full justify-between border border-white/30 
                 dark:bg-dark-bg-card dark:bg-opacity-60 dark:border-gray-300/10 dark:text-text-primary-dark"
    >
      <div>
        {/* File Type Icons: brand-orange for consistent document representation */}
        {file.type === 'pdf' ? (
          <FileText className="w-16 h-16 text-brand-orange-light mb-3 dark:text-brand-orange-dark" />
        ) : (
          <FileSpreadsheet className="w-16 h-16 text-brand-orange-light mb-3 dark:text-brand-orange-dark" />
        )}
        {/* File Name: Uses primary text colors */}
        <h3 className="text-lg font-semibold text-text-primary-light mb-2 break-words w-full h-12 overflow-hidden text-ellipsis line-clamp-2 dark:text-text-primary-dark">
          {file.name}
        </h3>
        {/* File Type Description: Uses brand orange for highlight, consistent with IncomingInvoicesPage */}
        <p className="text-sm text-brand-orange-light mb-4 dark:text-brand-orange-dark">{file.type.toUpperCase()} File</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 w-full min-h-[48px]">
        <button
          onClick={() => onView(file)}
          className="flex items-center px-4 py-2 bg-brand-orange-light/10 text-brand-orange-light rounded-lg 
                     hover:bg-brand-orange-light/20 transition-colors text-sm font-medium 
                     dark:bg-brand-orange-dark/10 dark:text-brand-orange-dark dark:hover:bg-brand-orange-dark/20"
          aria-label={`View ${file.name}`}
        >
          <Eye size={16} className="mr-1" /> View {file.type === 'xlsx' ? "/Edit" : ""}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg-canvas to-blue-50 p-8 
                    dark:from-dark-bg-canvas-start dark:via-dark-bg-canvas-via dark:to-dark-bg-canvas-end">
      
      <header className="flex justify-between items-center mb-10 pb-4 
                         border-b border-border-subtle-light dark:border-border-subtle-dark">
        <h1 className="text-4xl font-bold text-brand-orange-light dark:text-brand-orange-dark">Approved Invoices</h1>
        
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="px-6 py-2 bg-ui-blue-light/10 text-ui-blue-light rounded-lg shadow-md 
                     hover:bg-ui-blue-light/20 transition-colors duration-300 flex items-center 
                     dark:bg-ui-blue-dark/10 dark:text-ui-blue-dark dark:hover:bg-ui-blue-dark/20"
          aria-label="Back to Dashboard"
        >
          <LayoutDashboard className="inline-block mr-2" size={18} />
          Back to Dashboard
        </button>
      </header>

      {/* NEW: Search and Sort Controls (identical to IncomingInvoicesPage) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-light-bg-card border border-border-subtle-light 
                       text-text-primary-light focus:outline-none focus:ring-2 focus:ring-brand-orange-light 
                       dark:bg-dark-bg-card dark:border-border-subtle-dark dark:text-text-primary-dark dark:focus:ring-brand-orange-dark"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-1/2 md:w-1/4">
          <ListFilter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="appearance-none w-full pl-10 pr-4 py-2 rounded-lg bg-light-bg-card border border-border-subtle-light 
                       text-text-primary-light focus:outline-none focus:ring-2 focus:ring-brand-orange-light 
                       dark:bg-dark-bg-card dark:border-border-subtle-dark dark:text-text-primary-dark dark:focus:ring-brand-orange-dark"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="name-asc">Sort by: Name (A-Z)</option>
            <option value="name-desc">Sort by: Name (Z-A)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary-light dark:text-text-secondary-dark">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l-.707.707L13.5 18l4.207-4.207-.707-.707L13.5 16.5l-4.207-4.207zM10.707 7.05l.707-.707L6.5 2 2.293 6.207l.707.707L6.5 3.5l4.207 4.207z"/></svg>
          </div>
        </div>
      </div>

      {/* NEW: Enhanced Empty State Message */}
      {filteredAndSortedFiles.length === 0 ? (
        <div className="text-center p-10 bg-light-bg-card bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 dark:bg-dark-bg-card dark:bg-opacity-60 dark:border-gray-300/10">
          <FileText size={64} className="mx-auto mb-4 text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
          <p className="text-text-primary-light text-xl font-semibold dark:text-text-primary-dark mb-2">No Approved Invoices Yet!</p>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Once invoices are approved, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
          {filteredAndSortedFiles.map((file) => (
            <FileCard key={file.id} file={file} onView={onView} /> 
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedInvoicesPage;