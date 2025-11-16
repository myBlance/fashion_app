import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import ProductDescription from './ProductDescription';
import ProductReviews from './ProductReviews';
import BuyingGuide from './BuyingGuide';

interface ProductDetailTabsProps {
  productId: string;
  description: string;   // ✅ Thêm prop description
  details: string;       // ✅ Thêm prop details
}

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box p={3} sx={{ pt: 1 }}>{children}</Box> : null;
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
    <Box sx={{ width: '100%', mt: 5 }}>
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
          label="MÔ TẢ SẢN PHẨM"
          disableRipple
          sx={{
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#333',
            outline: 'none',
            '&.Mui-selected': {
              color: '#b11116',
            },
            '&:focus': { outline: 'none' },
            '&:hover': { backgroundColor: 'transparent' },
          }}
        />
        <Tab
          label="ĐÁNH GIÁ SẢN PHẨM"
          disableRipple
          sx={{
            ml: '10px',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#333',
            outline: 'none',
            '&.Mui-selected': {
              color: '#b11116',
            },
            '&:focus': { outline: 'none' },
            '&:hover': { backgroundColor: 'transparent' },
          }}
        />
        <Tab
          label="HƯỚNG DẪN MUA HÀNG"
          disableRipple
          sx={{
            ml: '10px',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#333',
            outline: 'none',
            '&.Mui-selected': {
              color: '#b11116',
            },
            '&:focus': { outline: 'none' },
            '&:hover': { backgroundColor: 'transparent' },
          }}
        />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <ProductDescription
          description={description}
          details={details}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <ProductReviews productId={productId} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <BuyingGuide />
      </TabPanel>
    </Box>
  );
}