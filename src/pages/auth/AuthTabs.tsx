import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

function TabPanel({ children, value, index }: any) {
    return value === index ? <Box p={3}>{children}</Box> : null;
}

export default function AuthTabs() {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') === 'register' ? 1 : 0; // "login" là mặc định
    const [tabIndex, setTabIndex] = useState(initialTab);

    useEffect(() => {
        // Cập nhật khi URL thay đổi (nếu có)
        const tab = searchParams.get('tab');
        setTabIndex(tab === 'register' ? 1 : 0);
    }, [searchParams]);

    const handleChange = (_: any, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ width: '100%', mx: 'auto', mt: 5 }}>
            <Tabs
                value={tabIndex}
                onChange={handleChange}
                centered
                sx={{
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#b11116',
                        height: '3px',
                    },
                }}
            >
                <Tab
                    label="ĐĂNG NHẬP"
                    disableRipple
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#333',
                        outline: 'none',
                        '&.Mui-selected': {
                            color: '#b11116',
                            border: 'none',
                        },
                        '&:focus': {
                            outline: 'none',
                        },
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    }}
                />
                <Tab
                    label="ĐĂNG KÝ"
                    disableRipple
                    sx={{
                        ml: '10px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#333',
                        outline: 'none',
                        '&.Mui-selected': {
                            color: '#b11116',
                            border: 'none',
                        },
                        '&:focus': {
                            outline: 'none',
                        },
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    }}
                />
            </Tabs>



            <TabPanel value={tabIndex} index={0}>
                <LoginPage />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <RegisterPage />
            </TabPanel>
        </Box>
    );
}
