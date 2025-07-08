// src/utils/constants.js

// Your actual SharePoint details from Azure
export const SHAREPOINT_SITE_ID = process.env.REACT_APP_SHAREPOINT_SID;
export const SHAREPOINT_DRIVE_ID = process.env.REACT_APP_SHAREPOINT_DID;

// Item IDs for the specific folders in your SharePoint drive
const INCOMING_INVOICES_FOLDER_ITEM_ID = process.env.REACT_APP_INCOMING_ID;
const APPROVED_INVOICES_FOLDER_ITEM_ID = process.env.REACT_APP_APPROVED_ID;
const PUBLISHED_DOCUMENTS_FOLDER_ITEM_ID = process.env.REACT_APP_PUBLISHED_ID;
const SENT_FOLDER_ITEM_ID = process.env.REACT_APP_SENT_git aID;

// Internal keys used throughout the app to reference the folders
export const FOLDER_NAMES = {
  INCOMING_INVOICES: 'incomingInvoices',
  APPROVED_INVOICES: 'approvedInvoices',
  PUBLISHED_DOCUMENTS: 'publishedDocuments',
  SENT_DOCUMENTS: 'sentDocuments',
};

// This object connects all the folder information, which is essential for the app's logic.
export const FOLDER_DETAILS = {
  [FOLDER_NAMES.INCOMING_INVOICES]: {
    id: INCOMING_INVOICES_FOLDER_ITEM_ID,
    title: 'To Be Approved',
    path: 'incomingInvoices'
  },
  [FOLDER_NAMES.APPROVED_INVOICES]: {
    id: APPROVED_INVOICES_FOLDER_ITEM_ID,
    title: 'Approved Invoices',
    path: 'approvedInvoices'
  },
  [FOLDER_NAMES.PUBLISHED_DOCUMENTS]: {
    id: PUBLISHED_DOCUMENTS_FOLDER_ITEM_ID,
    title: 'Raised in QuickBooks',
    path: 'publishedDocuments'
  },
  [FOLDER_NAMES.SENT_DOCUMENTS]: {
    id: SENT_FOLDER_ITEM_ID,
    title: 'Sent Invoices',
    path: 'sentDocuments'
  },
};