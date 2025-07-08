// src/pages/SentDocumentsPage.js

import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Search, ListFilter, FileText } from 'lucide-react';
// FIX: Change to default import for FileList
import FileList from '../components/FileList'; // Adjust path if your FileList is elsewhere

const SentDocumentsPage = ({ files = [], setCurrentPage, onView }) => {
  // State for search and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('newest'); // 'newest', 'oldest', 'name-asc', 'name-desc'

  // Filter and sort files based on state
  const filteredAndSortedFiles = useMemo(() => {
    let currentFiles = [...files];

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
      switch (sortCriteria) {
        case 'oldest':
          return a.id.localeCompare(b.id);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return b.id.localeCompare(a.id);
      }
    });

    return currentFiles;
  }, [files, searchTerm, sortCriteria]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg-canvas to-blue-50 p-8 
                    dark:from-dark-bg-canvas-start dark:via-dark-bg-canvas-via dark:to-dark-bg-canvas-end">
      
      <header className="flex justify-between items-center mb-10 pb-4 
                         border-b border-border-subtle-light dark:border-border-subtle-dark">
        <h1 className="text-4xl font-bold text-brand-orange-light dark:text-brand-orange-dark">Sent Invoices</h1>
        
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

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
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

      {filteredAndSortedFiles.length === 0 ? (
        <div className="text-center p-10 bg-light-bg-card bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 dark:bg-dark-bg-card dark:bg-opacity-60 dark:border-gray-300/10">
          <FileText size={64} className="mx-auto mb-4 text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
          <p className="text-text-primary-light text-xl font-semibold dark:text-text-primary-dark mb-2">No Sent Invoices Yet!</p>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Documents marked as sent will appear here.</p>
        </div>
      ) : (
        <FileList files={filteredAndSortedFiles} onView={onView} />
      )}
    </div>
  );
};

export default SentDocumentsPage;