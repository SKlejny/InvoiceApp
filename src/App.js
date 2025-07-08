import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

import { loginRequest } from './authConfig';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IncomingInvoicesPage from './pages/IncomingInvoicePage';
import PublishedDocumentsPage from './pages/PublishedDocumentsPage';

import EditFileModal from './components/EditFileModal';
import ViewFileModal from './components/ViewFileModal';

import {
  X, FileText, FileSpreadsheet, Eye, Pencil, CheckCircle, FolderOpen, LogIn, LayoutDashboard, ListTodo, FileBarChart
} from 'lucide-react';


function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [currentPage, setCurrentPage] = useState(isAuthenticated ? 'dashboard' : 'login');
  const userProfile = isAuthenticated && accounts.length > 0 ? accounts[0] : null;

  const [folders, setFolders] = useState({
    'Incoming Invoices': [],
    'Approved Invoices': [],
    'Published Documents': [],
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editedFileName, setEditedFileName] = useState('');
  const [editedFileContent, setEditedFileContent] = '';
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const messageTimeoutRef = useRef(null);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleMicrosoftLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      setCurrentPage('dashboard');
      showMessage('Logged in successfully!', 'success');
    } catch (error) {
      console.error("Microsoft login failed:", error);
      showMessage('Login failed. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
    setCurrentPage('login');
    showMessage('Logged out successfully.', 'success');
  };

  const getAccessToken = useCallback(async () => {
    if (accounts.length === 0) {
      console.error("getAccessToken: No active account found.");
      throw new Error("No active account found. Please login.");
    }
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      });
      console.log("getAccessToken: Acquired token:", response.accessToken ? "Token acquired successfully (not empty)" : "Token is empty/undefined");
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        console.warn("Interaction required to acquire token. Attempting popup...");
        try {
          const response = await instance.acquireTokenPopup(loginRequest);
          console.log("getAccessToken: Acquired token via popup:", response.accessToken ? "Token acquired successfully (not empty)" : "Token is empty/undefined");
          return response.accessToken;
        } catch (popupError) {
          console.error("Error acquiring token via popup:", popupError);
          showMessage('Authentication required. Please log in again.', 'error');
          handleLogout();
          throw popupError;
        }
      }
      console.error("Error acquiring token silently:", error);
      showMessage('Failed to acquire token. Please try again.', 'error');
      throw error;
    }
  }, [accounts, instance, showMessage, handleLogout]);


  // --- SharePoint API (Microsoft Graph) Integration Configuration ---
  // YOU MUST FILL THESE OUT with your actual SharePoint IDs and folder paths!
  // Use Microsoft Graph Explorer (https://developer.microsoft.com/en-us/graph/graph-explorer)
  // to find these values.
  //
  // 1. SHAREPOINT_SITE_ID: From GET https://graph.microsoft.com/v1.0/sites/eamlondon.sharepoint.com:/sites/EAM%20Internal
  const SHAREPOINT_SITE_ID = "e1e2139a-92c5-4119-b205-873bc5ebc9c1,ab64cec6-6c9e-44c2-bf5a-503f7f0ce6f4"; // <--- FILL THIS OUT (e.g., "eamlondon.sharepoint.com,some-guid,another-guid")

  // 2. SHAREPOINT_DRIVE_ID: From GET https://graph.microsoft.com/v1.0/sites/YOUR_SITE_ID/drives
  const SHAREPOINT_DRIVE_ID = "b!mhPi4cWSGUGyBYc7xevJwcbOZKuebMJEv1pQP38M5vSVB9dbz2pZTbiXu-pO9yIL"; // <--- FILL THIS OUT (e.g., "b!some-guid!another-guid")

  // 3. APPROVED_INVOICES_FOLDER_ITEM_ID: This is the ITEM ID of your 'Raised in QB' folder.
  //    From GET https://graph.microsoft.com/v1.0/sites/YOUR_SITE_ID/drives/YOUR_DRIVE_ID/root:/_EAM%20internal/2.%20Billing/EAM%20Invoices/Draft%20Invoices/Approved%20WIP/Raised%20in%20QB:/
  const APPROVED_INVOICES_FOLDER_ITEM_ID = "YOUR_APPROVED_INVOICES_FOLDER_ITEM_ID"; // <--- FILL THIS OUT (e.g., "0123456789abcdef")

  // 4. INCOMING_INVOICES_FOLDER_PATH: The full path to your 'Draft Invoices' folder.
  //    Matches the ID path part: /EAM%20Internal/_EAM%20internal/2.%20Billing/EAM%20Invoices/Draft%20Invoices
  const INCOMING_INVOICES_FOLDER_PATH = "_EAM internal/2. Billing/EAM Invoices/Draft Invoices"; // <--- NO ID, JUST THE PATH

  // 5. PUBLISHED_DOCUMENTS_FOLDER_PATH: The full path to your 'viewable' documents folder.
  //    YOU NEED TO DETERMINE THIS PATH IN YOUR SHAREPOINT.
  const PUBLISHED_DOCUMENTS_FOLDER_PATH = "OCUMENTS_FOLDER"; // <--- FILL THIS OUT (e.g., "EAM Documents/Reports")


  /**
   * Lists files in a SharePoint folder using Microsoft Graph API.
   * @param {string} folderFullPath The full path to the folder from the drive root.
   * @returns {Promise<Array>} A promise that resolves with an array of file objects.
   */
  const listFilesInSharePointFolder = useCallback(async (folderFullPath) => {
    if (!isAuthenticated) return [];
    if (!SHAREPOINT_SITE_ID || !SHAREPOINT_DRIVE_ID) {
      console.error("SharePoint Site ID or Drive ID not configured.");
      showMessage("SharePoint configuration missing. Cannot load files.", "error");
      return [];
    }

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Access token is empty. Cannot list files.");
      }
      console.log(`Fetching files from SharePoint folder: "${folderFullPath}"`);

      // Encode the entire folder path for the URL
      const encodedFolderPath = encodeURIComponent(folderFullPath);
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_SITE_ID}/drives/${SHAREPOINT_DRIVE_ID}/root:/${encodedFolderPath}:/children`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Graph API Error:", errorBody);
        throw new Error(`HTTP error listing files! Status: ${response.status} - ${response.statusText}. Details: ${errorBody.error.message || 'No further details.'}`);
      }
      const data = await response.json();
      
      // Filter out subfolders, only return files (Graph returns both by default)
      return data.value
        .filter(item => item.file) // Only include items that have a 'file' property (i.e., are files, not folders)
        .map(item => ({
          id: item.id,
          name: item.name,
          type: item.file ? (item.file.mimeType.includes('pdf') ? 'pdf' : 'xlsx') : 'unknown',
          // Note: item.size and item.lastModifiedDateTime are also available if needed for display
        }));

    } catch (error) {
      console.error(`Error listing files in SharePoint folder "${folderFullPPATH_TO_YOUR_PUBLISHED_Dath}":`, error);
      showMessage(`Failed to load files from ${folderFullPath}. Error: ${error.message}`, 'error');
      return [];
    }
  }, [isAuthenticated, getAccessToken, showMessage, SHAREPOINT_SITE_ID, SHAREPOINT_DRIVE_ID]); // Added missing dependency for listFilesInSharePointFolder


  /**
   * Reads the content of a file from SharePoint using Microsoft Graph API.
   * @param {object} file The file object (must have 'id' and 'name').
   * @returns {Promise<string>} A promise that resolves with the file content.
   */
  const readFileContent = useCallback(async (file) => {
    try {
      const accessToken = await getAccessToken();
       if (!accessToken) {
        throw new Error("Access token is empty. Cannot read file content.");
      }
      console.log(`Attempting to read content of "${file.name}" from SharePoint.`);

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_SITE_ID}/drives/${SHAREPOINT_DRIVE_ID}/items/${file.id}/content`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Graph API Error:", errorBody);
        throw new Error(`HTTP error reading file content! Status: ${response.status} - ${response.statusText}. Details: ${errorBody.error.message || 'No further details.'}`);
      }
      
      const content = await response.text(); 
      return content;

    } catch (error) {
      console.error("Error reading file content from SharePoint:", error);
      showMessage('Failed to read file content.', 'error');
      throw error;
    }
  }, [getAccessToken, showMessage, SHAREPOINT_SITE_ID, SHAREPOINT_DRIVE_ID]);


  /**
   * Updates a file's name and/or content in SharePoint using Microsoft Graph API.
   * @param {string} fileId The ID of the file to update.
   * @param {string} newName The new name for the file (optional).
   * @param {string} newContent The new content for the file (optional).
   * @returns {Promise<boolean>} A promise that resolves to true on success.
   */
  const updateFile = useCallback(async (fileId, newName, newContent) => {
    try {
      const accessToken = await getAccessToken();
       if (!accessToken) {
        throw new Error("Access token is empty. Cannot update file.");
      }
      console.log(`Attempting to update file ID "${fileId}" in SharePoint.`);

      let contentUpdateSuccess = true;

      // Handle content update first (PUT request to /content endpoint)
      if (newContent !== undefined) {
         const contentResponse = await fetch(
           `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_SITE_ID}/drives/${SHAREPOINT_DRIVE_ID}/items/${fileId}/content`,
           {
             method: 'PUT',
             headers: {
               'Authorization': `Bearer ${accessToken}`,
               'Content-Type': 'text/plain' // Adjust for actual XLSX file type (e.g., 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
             },
             body: newContent
           }
         );
         if (!contentResponse.ok) {
           contentUpdateSuccess = false;
           const errorBody = await contentResponse.json();
           console.error("Graph API Content Update Error:", errorBody);
           throw new Error(`Content update failed: ${contentResponse.status} - ${contentResponse.statusText}. Details: ${errorBody.error.message || 'No further details.'}`);
         }
      }

      // Handle name update (PATCH request to item endpoint)
      if (newName !== undefined && newName !== selectedFile?.name) { // Check if name actually changed
        const updatePayload = { name: newName };
        const renameResponse = await fetch(
          `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_SITE_ID}/drives/${SHAREPOINT_DRIVE_ID}/items/${fileId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatePayload)
          }
        );
        if (!renameResponse.ok) {
          const errorBody = await renameResponse.json();
          console.error("Graph API Rename Error:", errorBody);
          throw new Error(`Rename failed: ${renameResponse.status} - ${renameResponse.statusText}. Details: ${errorBody.error.message || 'No further details.'}`);
        }
      }

      if (contentUpdateSuccess) {
         fetchFolders(); // Re-fetch all relevant folder contents after successful update
         return true;
      }
      return false; // Indicate failure if content update failed

    } catch (error) {
      console.error("Error updating file in SharePoint:", error);
      showMessage('Failed to update file.', 'error');
      throw error;
    }
  }, [getAccessToken, showMessage, SHAREPOINT_SITE_ID, SHAREPOINT_DRIVE_ID, fetchFolders, selectedFile]); // Added selectedFile to dependencies


  /**
   * Moves a file from one folder to another in SharePoint using Microsoft Graph API.
   * @param {string} fileId The ID of the file to move.
   * @returns {Promise<boolean>} A promise that resolves to true on success.
   */
  const moveFile = useCallback(async (fileId) => {
    if (!APPROVED_INVOICES_FOLDER_ITEM_ID) {
      console.error("APPROVED_INVOICES_FOLDER_ITEM_ID is not configured.");
      showMessage("Approved Invoices folder ID missing. Cannot move file.", "error");
      return false;
    }
    try {
      const accessToken = await getAccessToken();
       if (!accessToken) {
        throw new Error("Access token is empty. Cannot move file.");
      }
      console.log(`Attempting to move file ID "${fileId}" to Approved Invoices folder.`);

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_SITE_ID}/drives/${SHAREPOINT_DRIVE_ID}/items/${fileId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            parentReference: {
              id: APPROVED_INVOICES_FOLDER_ITEM_ID // Use the ITEM ID of the destination folder
            }
          })
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Graph API Move Error:", errorBody);
        throw new Error(`Move failed: ${response.status} - ${response.statusText}. Details: ${errorBody.error.message || 'No further details.'}`);
      }

      fetchFolders(); // Re-fetch all relevant folder contents after successful move
      return true;

    } catch (error) {
      console.error("Error moving file in SharePoint:", error);
      showMessage('Failed to move file.', 'error');
      throw error;
    }
  }, [getAccessToken, showMessage, APPROVED_INVOICES_FOLDER_ITEM_ID, SHAREPOINT_DRIVE_ID, SHAREPOINT_SITE_ID, fetchFolders]);


  // Unified function to fetch files for all relevant folders
  const fetchFolders = useCallback(async () => {
    if (!isAuthenticated) {
      setFolders({ 'Incoming Invoices': [], 'Published Documents': [], 'Approved Invoices': [] });
      return;
    }
    // Only fetch if SharePoint IDs are provided
    if (!SHAREPOINT_SITE_ID || !SHAREPOINT_DRIVE_ID) {
      console.error("SharePoint configuration missing. Cannot fetch folders.");
      showMessage("SharePoint configuration missing. Please provide Site ID and Drive ID.", "error");
      return;
    }
    try {
      // Use the specific paths you determined from SharePoint
      const incoming = await listFilesInSharePointFolder(INCOMING_INVOICES_FOLDER_PATH);
      const published = await listFilesInSharePointFolder(PUBLISHED_DOCUMENTS_FOLDER_PATH);
      
      setFolders(prev => ({
        ...prev,
        'Incoming Invoices': incoming,
        'Published Documents': published,
      }));
    } catch (error) {
      console.error("Error fetching all folders:", error);
    }
  }, [isAuthenticated, listFilesInSharePointFolder, INCOMING_INVOICES_FOLDER_PATH, PUBLISHED_DOCUMENTS_FOLDER_PATH, SHAREPOINT_SITE_ID, SHAREPOINT_DRIVE_ID]);

  // Effect to fetch folder data when authenticated or when relevant pages are loaded
  useEffect(() => {
    if (isAuthenticated) {
      fetchFolders();
    } else {
      setFolders({ 'Incoming Invoices': [], 'Published Documents': [], 'Approved Invoices': [] });
    }
  }, [isAuthenticated, fetchFolders]);

  const handleEditClick = async (file) => {
    setSelectedFile(file);
    setEditedFileName(file.name);
    try {
      const content = await readFileContent(file);
      setEditedFileContent(content); // Corrected: this needs to be a useState setter
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Failed to load file content for editing:", error);
      showMessage('Could not load file content for editing.', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (selectedFile) {
      try {
        await updateFile(selectedFile.id, editedFileName, editedFileContent);
        showMessage('File saved successfully!', 'success');
        setIsEditModalOpen(false);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error saving file:", error);
        showMessage('Failed to save file.', 'error');
      }
    }
  };

  const handleApprove = async (fileId) => {
    try {
      await moveFile(fileId); 
      showMessage('Invoice approved and moved!', 'success');
    } catch (error) {
      console.error("Error approving invoice:", error);
      showMessage('Failed to approve invoice.', 'error');
    }
  };

  const handleView = async (file) => {
    setSelectedFile(file);
    try {
      const content = await readFileContent(file);
      setEditedFileContent(content); // Corrected: this needs to be a useState setter
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Failed to load file content for viewing:", error);
      showMessage('Could not load file content for viewing.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {message.text && (
        <div className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg z-50 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {message.text}
        </div>
      )}

      <main className="flex-grow">
        {!isAuthenticated ? (
          <LoginPage onLogin={handleMicrosoftLogin} />
        ) : (
          <>
            {currentPage === 'dashboard' && (
              <DashboardPage
                userProfile={userProfile}
                folders={folders}
                setCurrentPage={setCurrentPage}
                onLogout={handleLogout}
              />
            )}
            {currentPage === 'incomingInvoices' && (
              <IncomingInvoicesPage
                files={folders['Incoming Invoices']}
                setCurrentPage={setCurrentPage}
                onEdit={handleEditClick}
                onApprove={handleApprove}
                onView={handleView}
              />
            )}
            {currentPage === 'publishedDocuments' && (
              <PublishedDocumentsPage
                files={folders['Published Documents']}
                setCurrentPage={setCurrentPage}
                onView={handleView}
              />
            )}
          </>
        )}
      </main>

      <EditFileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        fileName={editedFileName}
        onFileNameChange={(e) => setEditedFileName(e.target.value)}
        fileContent={editedFileContent}
        onFileContentChange={(e) => setEditedFileContent(e.target.value)}
        onSave={handleSaveEdit}
      />
      <ViewFileModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        fileName={selectedFile?.name || ''}
        fileContent={editedFileContent}
      />

      <footer className="text-center text-gray-500 mt-auto py-4 text-sm bg-gray-50 w-full border-t border-gray-200">
        <p>&copy; 2024 Invoice System. All rights reserved. </p>
        <p className="text-xs mt-2">
          This application is now attempting direct SharePoint integration via Microsoft Graph API.
        </p>
      </footer>
    </div>
  );
}

export default App;
