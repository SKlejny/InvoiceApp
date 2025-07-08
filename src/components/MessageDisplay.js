// src/components/MessageDisplay.js

import React, { useEffect } from 'react';

const MessageDisplay = ({ message, onClearMessage }) => {
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        onClearMessage();
      }, 5000); // Message disappears after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClearMessage]);

  if (!message.text) return null;

  return (
    <div className={`fixed top-4 left-4 p-3 rounded-lg shadow-lg z-50 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
      {message.text}
    </div>
  );
};

export default MessageDisplay;