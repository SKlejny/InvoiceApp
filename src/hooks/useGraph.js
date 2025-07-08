// src/hooks/useGraph.js
import { useState, useCallback } from 'react';
import { getAccessToken, fetchFilesFromFolder, moveFile, downloadFileContent } from '../services/sharepointService';
import { FOLDER_DETAILS, FOLDER_NAMES } from '../utils/constants';

const initialFoldersState = {
    [FOLDER_NAMES.INCOMING_INVOICES]: [],
    [FOLDER_NAMES.APPROVED_INVOICES]: [],
    [FOLDER_NAMES.PUBLISHED_DOCUMENTS]: [],
    [FOLDER_NAMES.SENT_DOCUMENTS]: [],
};

const useGraph = (instance, accounts) => {
  const [folders, setFolders] = useState(initialFoldersState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSharePointData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken(instance, accounts);
      const folderPromises = Object.entries(FOLDER_DETAILS).map(async ([key, details]) => {
        const files = await fetchFilesFromFolder(accessToken, details.id);
        return { [details.path]: files };
      });
      const results = await Promise.all(folderPromises);
      const allFolders = results.reduce((acc, current) => ({ ...acc, ...current }), {});
      setFolders(allFolders);
    } catch (e) {
      console.error("Failed to fetch SharePoint data:", e);
      setError("Could not load files from SharePoint. Please refresh.");
    } finally {
      setIsLoading(false);
    }
    // FIX: The dependency array should not include `isLoading`.
  }, [instance, accounts]);

  const moveSharePointFile = useCallback(async (fileId, sourceFolderId, destinationFolderId) => {
    setIsLoading(true);
    try {
      const accessToken = await getAccessToken(instance, accounts);
      await moveFile(accessToken, fileId, destinationFolderId);
    } catch (e) {
      console.error("Failed to move file:", e);
      throw new Error("Failed to move the file.");
    } finally {
      setIsLoading(false);
    }
  }, [instance, accounts]);
  
  const downloadFileFromSharePoint = useCallback(async (file) => {
    setIsLoading(true);
    try {
        const accessToken = await getAccessToken(instance, accounts);
        return await downloadFileContent(accessToken, file);
    } catch(e) {
        console.error("Failed to download file content:", e);
        throw new Error("Could not download file content.");
    } finally {
        setIsLoading(false);
    }
  }, [instance, accounts]);

  return { folders, isLoading, error, fetchSharePointData, moveSharePointFile, downloadFileFromSharePoint };
};

export default useGraph;