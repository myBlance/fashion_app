import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

const AuthTextField: React.FC<TextFieldProps> = (props) => {
    return (
        <TextField
            variant="filled"
            fullWidth
            {...props}
            sx={{
                width: '100%',
                mb: 2,
                ...props.sx,
                '& .MuiFilledInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '4px',
                    color: '#000000',
                    border: '2px solid #999999',
                    boxShadow: 'none',
                    paddingLeft: '5px',
                    transition: 'background-color 0s',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&:before': {
                        borderBottom: 'none !important',
                    },
                    '&:after': {
                        borderBottom: 'none !important',
                    },
                    '&:hover:before': {
                        borderBottom: 'none !important',
                    },
                    '& input': {
                        caretColor: '#000000',
                    },
                    '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(0,0,0,0) inset !important',
                        WebkitTextFillColor: '#000000 !important',
                        transition: 'background-color 0s 600000s, color 0s 600000s',
                        borderRadius: '40px',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#000000',
                    left: '5px',
                    '&.Mui-focused': {
                        color: '#000000',
                    },
                },
            }}
        />
    );
};

export default AuthTextField;
