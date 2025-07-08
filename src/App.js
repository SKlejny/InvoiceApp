// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from './authConfig';

// --- Hooks ---
import useGraph from './hooks/useGraph';

// --- Your Original Pages ---
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IncomingInvoicesPage from './pages/IncomingInvoicePage';
import ApprovedInvoicesPage from './pages/ApprovedInvoicesPage';
import PublishedDocumentsPage from './pages/PublishedDocumentsPage';
import SentDocumentsPage from './pages/SentDocumentsPage';

// --- Components ---
import LoadingSpinner from './components/LoadingSpinner';
import MessageDisplay from './components/MessageDisplay';
import Header from './components/Header';
import ConfirmModal from './components/ConfirmModal';
import ViewFileModal from './components/ViewFileModal';
import ExcelChoiceModal from './components/ExcelChoiceModal';
import SettingsModal from './components/SettingsModal';

import { FOLDER_DETAILS, FOLDER_NAMES } from './utils/constants';

function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const {
    folders,
    isLoading,
    error,
    fetchSharePointData,
    moveSharePointFile,
    downloadFileFromSharePoint,
  } = useGraph(instance, accounts);

  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const [currentPage, setCurrentPage] = useState('login');
  const [modal, setModal] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [viewedFileContent, setViewedFileContent] = useState(null);
  const [excelOpeningPreference, setExcelOpeningPreference] = useState(() => localStorage.getItem('excelOpeningPreference') || 'ask');

  const showMessage = useCallback((text, type = 'info') => {
    setMessage({ text, type });
  }, []);

  useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      const fetchProfile = async () => {
        try {
          const response = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] });
          const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me', { headers: { Authorization: `Bearer ${response.accessToken}` } });
          const profile = await graphResponse.json();
          setUserProfile(profile);
          setCurrentPage('dashboard');
          fetchSharePointData();
        } catch (e) {
          console.error(e);
          showMessage('Could not fetch user profile.', 'error');
        }
      };
      fetchProfile();
    } else {
      setCurrentPage('login');
    }
  }, [isAuthenticated, accounts, instance, fetchSharePointData, showMessage]);

  useEffect(() => {
    if (error) {
        showMessage(error, 'error');
    }
  }, [error, showMessage]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('excelOpeningPreference', excelOpeningPreference);
  }, [excelOpeningPreference]);

  const handleLogout = () => {
    if (accounts.length > 0) {
        instance.logoutPopup({
            account: accounts[0]
        }).catch(e => {
            console.error(e);
        });
    }
  };

  const handleMicrosoftLogin = () => instance.loginPopup(loginRequest).catch(e => console.error(e));

  const handleExcelOpen = useCallback((file) => {
    if (excelOpeningPreference === 'ask') {
      setModal('excelChoice');
    } else if (excelOpeningPreference === 'web') {
      window.open(file.webUrl, '_blank');
    } else {
      window.location.href = `ms-excel:ofe|u|${encodeURIComponent(file.webUrl)}`;
    }
  }, [excelOpeningPreference]);

  const handleView = useCallback(async (file) => {
    setSelectedFile(file);
    if (file.type === 'xlsx') {
        handleExcelOpen(file);
    } else {
        try {
            const content = await downloadFileFromSharePoint(file);
            setViewedFileContent(content);
            setModal('viewFile');
        } catch (e) {
            showMessage(e.message, 'error');
        }
    }
  }, [downloadFileFromSharePoint, handleExcelOpen, showMessage]);

  const handleApprove = useCallback((fileId) => {
    const fileToApprove = folders[FOLDER_NAMES.INCOMING_INVOICES]?.find(f => f.id === fileId);
    if (fileToApprove) {
        setSelectedFile(fileToApprove);
        setModal('confirmApproval');
    }
  }, [folders]);

  const handleSent = useCallback((fileId) => {
    const fileToSend = folders[FOLDER_NAMES.PUBLISHED_DOCUMENTS]?.find(f => f.id === fileId);
    if(fileToSend) {
        setSelectedFile(fileToSend);
        setModal('confirmSent');
    }
  }, [folders]);

  const handleConfirm = useCallback(async () => {
    if (!selectedFile || !modal) return;
    const action = modal;
    const originalFile = selectedFile;
    setModal(null);
    try {
      let successMessage = '';
      if (action === 'confirmApproval') {
        const sourceFolderId = FOLDER_DETAILS.incomingInvoices.id;
        const destFolderId = FOLDER_DETAILS.approvedInvoices.id;
        await moveSharePointFile(originalFile.id, sourceFolderId, destFolderId);
        successMessage = 'File approved successfully.';
      } else if (action === 'confirmSent') {
        const sourceFolderId = FOLDER_DETAILS.publishedDocuments.id;
        const destFolderId = FOLDER_DETAILS.sentDocuments.id;
        await moveSharePointFile(originalFile.id, sourceFolderId, destFolderId);
        successMessage = 'File marked as sent.';
      }
      showMessage(successMessage, 'success');
      fetchSharePointData();
    } catch (e) {
      showMessage(e.message, 'error');
    }
  }, [selectedFile, modal, moveSharePointFile, showMessage, fetchSharePointData]);

  // FIX: The switch statement was broken here. It is now fully restored.
  const renderPage = () => {
    switch (currentPage) {
        case 'dashboard':
            return <DashboardPage userProfile={userProfile} folders={folders} setCurrentPage={setCurrentPage} />;
        case 'incomingInvoices':
            return <IncomingInvoicesPage files={folders[FOLDER_NAMES.INCOMING_INVOICES] || []} setCurrentPage={setCurrentPage} onView={handleView} onApprove={handleApprove} />;
        case 'approvedInvoices':
            return <ApprovedInvoicesPage files={folders[FOLDER_NAMES.APPROVED_INVOICES] || []} setCurrentPage={setCurrentPage} onView={handleView} />;
        case 'publishedDocuments':
            return <PublishedDocumentsPage files={folders[FOLDER_NAMES.PUBLISHED_DOCUMENTS] || []} setCurrentPage={setCurrentPage} onView={handleView} onSent={handleSent} />;
        case 'sentDocuments':
            return <SentDocumentsPage files={folders[FOLDER_NAMES.SENT_DOCUMENTS] || []} setCurrentPage={setCurrentPage} onView={handleView} />;
        default:
            return <LoginPage onLogin={handleMicrosoftLogin} />;
    }
  };

  const closeModal = () => {
    setModal(null);
    setSelectedFile(null);
    if (viewedFileContent && viewedFileContent.startsWith('blob:')) {
      URL.revokeObjectURL(viewedFileContent);
    }
    setViewedFileContent(null);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleMicrosoftLogin} />;
  }

  return (
    <div className="min-h-screen bg-light-bg-canvas dark:bg-dark-bg-card text-text-primary-light dark:text-text-primary-dark">
      {isLoading && <LoadingSpinner />}
      <MessageDisplay message={message} onClearMessage={() => setMessage({ text: '', type: '' })} />

      <Header
        onLogout={handleLogout}
        onRefresh={fetchSharePointData}
        onSettingsClick={() => setModal('settings')}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />

      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        {renderPage()}
      </main>

      <ConfirmModal
        isOpen={modal === 'confirmApproval' || modal === 'confirmSent'}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={modal === 'confirmApproval' ? "Confirm Approval" : "Confirm Sent"}
        message={`Are you sure you want to proceed with this action for "${selectedFile?.name}"?`}
      />
      <ViewFileModal
        isOpen={modal === 'viewFile'}
        onClose={closeModal}
        file={selectedFile}
        content={viewedFileContent}
      />
      <ExcelChoiceModal
        isOpen={modal === 'excelChoice'}
        onClose={closeModal}
        fileName={selectedFile?.name || ''}
        onOpenWeb={() => { window.open(selectedFile?.webUrl, '_blank'); closeModal(); }}
        onOpenDesktop={() => { window.location.href = `ms-excel:ofe|u|${encodeURIComponent(selectedFile?.webUrl)}`; closeModal(); }}
      />
      <SettingsModal
        isOpen={modal === 'settings'}
        onClose={closeModal}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(prev => !prev)}
        currentExcelPreference={excelOpeningPreference}
        onPreferenceChange={setExcelOpeningPreference}
      />
    </div>
  );
}

export default App;