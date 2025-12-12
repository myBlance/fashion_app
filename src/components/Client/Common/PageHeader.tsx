import { Box, Typography } from '@mui/material';
import React from 'react';
import DynamicBreadcrumbs from '../Breadcrumb/DynamicBreadcrumbs';

interface PageHeaderProps {
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    return (
        <Box mb={4}>
            <DynamicBreadcrumbs />
            <Box mt={2}>
                <Typography variant="h4" fontWeight="bold" color="#d32f2f" textAlign={{ xs: 'center', md: 'left' }} sx={{ textTransform: 'uppercase' }}>
                    {title}
                </Typography>
                <Box sx={{ width: 60, height: 4, bgcolor: '#d32f2f', mt: 1, mx: { xs: 'auto', md: 0 }, borderRadius: 1 }} />
            </Box>
        </Box>
    );
};

export default PageHeader;
