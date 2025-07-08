// src/pages/DashboardPage.js
import React from 'react';
import { LayoutDashboard, ListTodo, FileBarChart, CheckCircle, Send } from 'lucide-react';
import { FOLDER_NAMES, FOLDER_DETAILS } from '../utils/constants';

const FolderCard = ({ title, icon, count, onClick }) => (
  <div
    onClick={onClick}
    className="bg-light-bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl flex flex-col items-center justify-center 
               cursor-pointer transition-transform transform hover:-translate-y-1 hover:scale-105 duration-300 
               border border-border-subtle-light hover:border-brand-orange-light 
               dark:bg-dark-bg-card dark:border-border-subtle-dark dark:hover:border-brand-orange-dark"
    role="button"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-text-primary-light text-center dark:text-text-primary-dark">{title}</h3>
    <p className="text-sm text-text-secondary-light mt-2 dark:text-text-secondary-dark">{count} {count === 1 ? 'file' : 'files'}</p>
  </div>
);

const DashboardPage = ({ userProfile, folders, setCurrentPage }) => {
  const getFolderCount = (folderKey) => folders[folderKey]?.length ?? 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <LayoutDashboard className="w-12 h-12 text-brand-orange-light dark:text-brand-orange-dark mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">Dashboard</h1>
        {userProfile && (
          <p className="text-text-secondary-light mt-2 text-lg dark:text-text-secondary-dark">
            Welcome back, <span className="font-semibold text-ui-blue-light dark:text-ui-blue-dark">{userProfile.displayName}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FolderCard
          title="To be Approved"
          icon={<ListTodo size={40} className="text-status-attention-light dark:text-status-attention-dark" />}
          count={getFolderCount(FOLDER_NAMES.INCOMING_INVOICES)}
          onClick={() => setCurrentPage(FOLDER_DETAILS.incomingInvoices.path)}
        />
        <FolderCard
          title="Approved Invoices"
          icon={<CheckCircle size={40} className="text-status-approved-light dark:text-status-approved-dark" />}
          count={getFolderCount(FOLDER_NAMES.APPROVED_INVOICES)}
          onClick={() => setCurrentPage(FOLDER_DETAILS.approvedInvoices.path)}
        />
        <FolderCard
          title="Raised in QuickBooks"
          icon={<FileBarChart size={40} className="text-status-raised-light dark:text-status-raised-dark" />}
          count={getFolderCount(FOLDER_NAMES.PUBLISHED_DOCUMENTS)}
          onClick={() => setCurrentPage(FOLDER_DETAILS.publishedDocuments.path)}
        />
        <FolderCard
          title="Sent Invoices"
          icon={<Send size={40} className="text-status-pending-light dark:text-status-pending-dark" />}
          count={getFolderCount(FOLDER_NAMES.SENT_DOCUMENTS)}
          onClick={() => setCurrentPage(FOLDER_DETAILS.sentDocuments.path)}
        />
      </div>
    </div>
  );
};

export default DashboardPage;