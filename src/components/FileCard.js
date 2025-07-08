// src/components/FileCard.js
import React from 'react';
import { FileText, FileSpreadsheet, Eye, CheckCircle, Send } from 'lucide-react';
import { FOLDER_NAMES } from '../utils/constants';

const ActionButton = ({ onClick, icon, text, colorClass }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 w-full ${colorClass}`}
  >
    {icon}
    {text}
  </button>
);

const FileCard = ({ file, onFileAction, pageType }) => {
  const FileIcon = file.type === 'xlsx' ? FileSpreadsheet : FileText;

  const renderActionButtons = () => {
    switch (pageType) {
      case FOLDER_NAMES.INCOMING_INVOICES:
        return (
          <>
            <ActionButton
              onClick={() => onFileAction('view', file)}
              icon={<Eye size={16} className="mr-1.5" />}
              text={file.type === 'xlsx' ? 'View/Edit' : 'View'}
              colorClass="bg-brand-orange-light/10 text-brand-orange-light hover:bg-brand-orange-light/20"
            />
            <ActionButton
              onClick={() => onFileAction('approve', file)}
              icon={<CheckCircle size={16} className="mr-1.5" />}
              text="Approve"
              colorClass="bg-status-approved-light/10 text-status-approved-light hover:bg-status-approved-light/20 dark:bg-status-approved-dark/10 dark:text-status-approved-dark dark:hover:bg-status-approved-dark/20"
            />
          </>
        );
      case FOLDER_NAMES.PUBLISHED_DOCUMENTS:
        return (
            <>
                <ActionButton
                    onClick={() => onFileAction('view', file)}
                    icon={<Eye size={16} className="mr-1.5" />}
                    text="View"
                    colorClass="bg-ui-blue-light/10 text-ui-blue-light hover:bg-ui-blue-light/20 dark:bg-ui-blue-dark/10 dark:text-ui-blue-dark dark:hover:bg-ui-blue-dark/20"
                />
                <ActionButton
                    onClick={() => onFileAction('sent', file)}
                    icon={<Send size={16} className="mr-1.5" />}
                    text="Mark Sent"
                    colorClass="bg-status-pending-light/10 text-status-pending-light hover:bg-status-pending-light/20 dark:bg-status-pending-dark/10 dark:text-status-pending-dark dark:hover:bg-status-pending-dark/20"
                />
            </>
        );
      default:
        return (
          <ActionButton
            onClick={() => onFileAction('view', file)}
            icon={<Eye size={16} className="mr-1.5" />}
            text={file.type === 'xlsx' ? 'View/Edit' : 'View'}
            colorClass="bg-ui-blue-light/10 text-ui-blue-light hover:bg-ui-blue-light/20 dark:bg-ui-blue-dark/10 dark:text-ui-blue-dark dark:hover:bg-ui-blue-dark/20"
          />
        );
    }
  };

  return (
    <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-xl shadow-lg hover:shadow-xl p-4 flex flex-col transition-all duration-200 border border-border-subtle-light/50 dark:border-border-subtle-dark/50">
      <div className="flex-grow flex flex-col items-center text-center mb-4">
        <FileIcon className="w-16 h-16 mb-3 text-brand-orange-light dark:text-brand-orange-dark" />
        <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark w-full h-12 overflow-hidden text-ellipsis break-words line-clamp-2">
          {file.name}
        </h3>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
          {file.type.toUpperCase()}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-2 w-full">
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default FileCard;