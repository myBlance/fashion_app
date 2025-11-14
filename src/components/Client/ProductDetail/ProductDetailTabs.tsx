import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import ProductDescription from './ProductDescription';
import ProductReviews from './ProductReviews';
import BuyingGuide from './BuyingGuide'; 

// Giả lập dữ liệu mô tả
const productDescription = "Đây là sản phẩm tuyệt vời, chất lượng cao, thiết kế thời trang, phù hợp với mọi lứa tuổi.";
const productDetails = [
  "Chất liệu: 100% cotton",
  "Màu sắc: Đen, Trắng, Xanh",
  "Kích thước: S, M, L, XL",
  "Xuất xứ: Việt Nam",
];

interface ProductDetailTabsProps {
  productId: string;
}


function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box p={3} sx={{ pt: 1 }}>{children}</Box> : null;
}

export default function ProductDetailTabs({ productId }: ProductDetailTabsProps) {
    
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
        <Tab // 👈 Thêm tab mới
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
          description={productDescription}
          details={productDetails}
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