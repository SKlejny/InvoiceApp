// src/pages/publishedDocumentspage.js
import React, { useState, useMemo } from 'react';
import { LayoutDashboard, FileText, FileSpreadsheet } from 'lucide-react';
import FileCard from '../components/FileCard';
import SearchAndSort from '../components/SearchAndSort';

const PublishedDocumentsPage = ({ files = [], setCurrentPage, onView, onSent }) => {
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

  // Split the files into two groups
  const pdfFiles = filteredAndSortedFiles.filter(file => file.type === 'pdf');
  const xlsxFiles = filteredAndSortedFiles.filter(file => file.type === 'xlsx');

  const renderFileList = (list, title, icon) => (
    <div className="flex-1">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark ml-2">{title}</h2>
      </div>
      {list.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {list.map(file => (
                <FileCard
                    key={file.id}
                    file={file}
                    // Use onFileAction to handle clicks consistently
                    onFileAction={(action, file) => {
                        if(action === 'view') onView(file);
                        if(action === 'sent') onSent(file.id);
                    }}
                    pageType="publishedDocuments"
                />
            ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-light-bg-card/50 dark:bg-dark-bg-card/50 rounded-xl shadow-inner h-full flex items-center justify-center">
             <p className="text-text-secondary-light dark:text-text-secondary-dark">No {title} found.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-light-bg-canvas dark:bg-dark-bg-card text-text-primary-light dark:text-text-primary-dark p-8">
      <header className="flex justify-between items-center mb-10 pb-4 border-b border-border-subtle-light dark:border-border-subtle-dark">
        <h1 className="text-4xl font-bold text-brand-orange-light dark:text-brand-orange-dark">Raised in QuickBooks</h1>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="px-6 py-2 bg-ui-blue-light/10 text-ui-blue-light rounded-lg shadow-md hover:bg-ui-blue-light/20 transition-colors duration-300 flex items-center dark:bg-ui-blue-dark/10 dark:text-ui-blue-dark dark:hover:bg-ui-blue-dark/20"
          aria-label="Back to Dashboard"
        >
          <LayoutDashboard className="inline-block mr-2" size={18} />
          Back to Dashboard
        </button>
      </header>
      
      <SearchAndSort
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
      />

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {renderFileList(pdfFiles, "PDF Invoices", <FileText size={28} className="text-brand-orange-light dark:text-brand-orange-dark" />)}
        <div className="border-b lg:border-l border-border-subtle-light dark:border-border-subtle-dark"></div>
        {renderFileList(xlsxFiles, "Excel Invoices", <FileSpreadsheet size={28} className="text-brand-orange-light dark:text-brand-orange-dark" />)}
      </div>
    </div>
  );
};

export default PublishedDocumentsPage;