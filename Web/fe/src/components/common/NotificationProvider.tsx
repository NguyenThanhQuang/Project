import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, type AlertProps } from '@mui/material';
import type { Notification } from '../../types';

interface NotificationContextType {
  showNotification: ((notification: Omit<Notification, 'id'>) => void) & ((message: string, type?: Notification['type']) => void);
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((
    notificationDataOrMessage: Omit<Notification, 'id'> | string,
    type?: Notification['type']
  ) => {
    let newNotification: Notification;
    
    if (typeof notificationDataOrMessage === 'string') {
      // Handle old signature: showNotification(message, type)
      newNotification = {
        id: Date.now().toString(),
        title: '',
        message: notificationDataOrMessage,
        type: type || 'info',
      };
    } else {
      // Handle new signature: showNotification(notification)
      newNotification = {
        ...notificationDataOrMessage,
        id: Date.now().toString(),
      };
    }
    
    setNotification(newNotification);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideNotification();
  };

  const getSeverity = (type: Notification['type']): AlertProps['severity'] => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
        <Snackbar
          open={true}
          autoHideDuration={notification.duration || 6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            severity={getSeverity(notification.type)}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.title && (
              <strong>{notification.title}: </strong>
            )}
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
}; 