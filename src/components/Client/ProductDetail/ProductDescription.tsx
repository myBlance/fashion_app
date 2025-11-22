import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';

interface ProductDescriptionProps {
  description: string;
  details: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description, details }) => {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
      {/* Phần Chi tiết kĩ thuật (Thường quan trọng nên đưa lên hoặc highlight) */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#f9f9f9', borderColor: '#eee' }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <InfoIcon color="primary" sx={{ color: '#b11116' }} />
          <Typography variant="h6" fontWeight="bold" textTransform="uppercase" color="#333">
            Thông số chi tiết
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            whiteSpace: 'pre-line', // Giữ xuống dòng
            lineHeight: 1.8,
            fontSize: '15px'
          }}
        >
          {details || "Đang cập nhật thông tin chi tiết..."}
        </Typography>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Phần Mô tả bài viết */}
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <DescriptionIcon color="primary" sx={{ color: '#b11116' }} />
          <Typography variant="h6" fontWeight="bold" textTransform="uppercase" color="#333">
            Mô tả sản phẩm
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-line', 
            lineHeight: 1.8, 
            color: '#222',
            fontSize: '16px',
            textAlign: 'justify' 
          }}
        >
          {description || "Đang cập nhật mô tả..."}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductDescription;