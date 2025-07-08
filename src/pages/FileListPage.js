// src/pages/FileListPage.js
import React, { useState, useMemo } from 'react';
import { FileText } from 'lucide-react'; // Keep only the used icon
import FileCard from '../components/FileCard';
import SearchAndSort from '../components/SearchAndSort'; // This now exists

const FileListPage = ({ title, files = [], onFileAction, pageType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('newest');

  const filteredAndSortedFiles = useMemo(() => {
    return files
      .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        switch (sortCriteria) {
          case 'oldest': return new Date(a.createdDateTime) - new Date(b.createdDateTime);
          case 'name-asc': return a.name.localeCompare(b.name);
          case 'name-desc': return b.name.localeCompare(a.name);
          case 'newest':
          default:
            return new Date(b.createdDateTime) - new Date(a.createdDateTime);
        }
      });
  }, [files, searchTerm, sortCriteria]);

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">{title}</h1>
      
      <SearchAndSort
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
      />

      {filteredAndSortedFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredAndSortedFiles.map(file => (
            <FileCard key={file.id} file={file} onFileAction={onFileAction} pageType={pageType} />
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-light-bg-card/50 dark:bg-dark-bg-card/50 rounded-xl shadow-inner">
          <FileText size={50} className="mx-auto mb-4 text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
          <p className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">No files found.</p>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            {searchTerm ? 'Try adjusting your search.' : `This folder is currently empty.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileListPage;