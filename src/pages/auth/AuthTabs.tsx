import { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
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
        <Box sx={{ width: '100%', maxWidth: 450, mx: 'auto', mt: 5 }}>
            <Tabs value={tabIndex} onChange={handleChange} centered sx={{ml: '24px'}}>
                <Tab label="ĐĂNG NHẬP" />
                <Tab label="ĐĂNG KÝ" sx={{ml:'10px'}}/>
            </Tabs>

            <TabPanel value={tabIndex} index={0}>
                <LoginPage />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <RegisterPage/>
            </TabPanel>
        </Box>
    );
}
