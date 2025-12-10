import { Alert, AlertColor, Snackbar } from '@mui/material';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');

    const showToast = (msg: string, type: AlertColor = 'info') => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};
