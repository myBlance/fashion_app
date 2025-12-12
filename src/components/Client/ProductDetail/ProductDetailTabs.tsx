import { Box, Container, Paper, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import BuyingGuide from './BuyingGuide';
import ProductDescription from './ProductDescription';
import ProductReviews from './ProductReviews';
import StorePolicies from './StorePolicies';

interface ProductDetailTabsProps {
  productId: string;
  description: string;
  details: string;
}

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box sx={{ py: 3, px: { xs: 0, md: 2 } }}>{children}</Box> : null;
}

export default function ProductDetailTabs({
  productId,
  description = '',
  details = ''
}: ProductDetailTabsProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 0, md: 2 } }}>
      <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff', borderRadius: 1 }}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            variant="scrollable" // Cho phép cuộn ngang trên mobile
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#b11116',
                height: '3px',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '13px', md: '15px' }, // Font nhỏ hơn trên mobile
                color: '#555',
                minHeight: '48px',
                '&.Mui-selected': {
                  color: '#b11116',
                },
                '&:hover': { color: '#b11116', opacity: 0.8 },
              }
            }}
          >
            <Tab label="Mô Tả Sản Phẩm" disableRipple />
            <Tab label="Đánh Giá" disableRipple />
            <Tab label="Hướng Dẫn Mua Hàng" disableRipple />
            <Tab label="Chính Sách & Ưu Đãi" disableRipple />
          </Tabs>
        </Box>

        <Box sx={{ bgcolor: '#fff', minHeight: '200px', borderRadius: '0 0 4px 4px' }}>
          <TabPanel value={tabIndex} index={0}>
            <ProductDescription description={description} details={details} />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <ProductReviews productId={productId} />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <BuyingGuide />
          </TabPanel>
          <TabPanel value={tabIndex} index={3}>
            <StorePolicies />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
}