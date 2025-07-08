// src/services/sharepointService.js
import { SHAREPOINT_SITE_ID, SHAREPOINT_DRIVE_ID } from '../utils/constants';
import { loginRequest } from '../authConfig';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

/**
 * Acquires an access token from MSAL, handling interactive popups if needed.
 * This is the single source of truth for getting a token.
 */
export const getAccessToken = async (instance, accounts) => {
  if (!instance || !accounts || accounts.length === 0) {
    throw new Error("MSAL instance or accounts not available.");
  }
  const request = { ...loginRequest, account: accounts[0] };

  try {
    const response = await instance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      const response = await instance.acquireTokenPopup(request);
      return response.accessToken;
    }
    throw error;
  }
};

/**
 * Fetches the list of files from a specific SharePoint folder.
 * @param {string} accessToken - The authenticated access token.
 * @param {string} folderId - The ID of the SharePoint folder.
 * @returns {Promise<Array>} A promise that resolves to an array of file items.
 */
export const fetchFilesFromFolder = async (accessToken, folderId) => {
  const url = `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_SITE_ID}/drives/${SHAREPOINT_DRIVE_ID}/items/${folderId}/children`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) throw new Error(`Failed to fetch files from folder ${folderId}`);
  
  const data = await response.json();
  // Map to a consistent file object format
  return data.value
    .filter(item => item.file) // Ensure we only process files, not folders
    .map(item => ({
      id: item.id,
      name: item.name,
      webUrl: item.webUrl,
      downloadUrl: item["@microsoft.graph.downloadUrl"],
      createdDateTime: item.createdDateTime,
      type: item.name.toLowerCase().endsWith('.xlsx') ? 'xlsx' : 'pdf', // Simple type detection
    }));
};

/**
 * Moves a file from one SharePoint folder to another.
 * @param {string} accessToken - The authenticated access token.
 * @param {string} fileId - The ID of the file to move.
 * @param {string} destinationFolderId - The ID of the target folder.
 */
export const moveFile = async (accessToken, fileId, destinationFolderId) => {
  const url = `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_SITE_ID}/drives/${SHAREPOINT_DRIVE_ID}/items/${fileId}`;
  
  const body = {
    parentReference: { id: destinationFolderId }
  };

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error('Failed to move file.');
};

/**
 * Downloads the content of a file. For PDFs, it returns a blob URL.
 * @param {string} accessToken - The authenticated access token.
 * @param {object} file - The file object, containing its downloadUrl.
 * @returns {Promise<string>} A promise that resolves to the file content or a blob URL.
 */
export const downloadFileContent = async (accessToken, file) => {
  if (!file.downloadUrl) throw new Error("File has no download URL.");

  const response = await fetch(file.downloadUrl, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) throw new Error('Failed to download file content.');

  // For PDFs and other viewable types, create a blob URL to render in an iframe
  if (file.type === 'pdf') {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
  }

  // For other types, you might return text or handle differently
  return await response.text();
};