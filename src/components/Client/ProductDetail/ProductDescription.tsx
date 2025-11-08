import React from 'react';
import { Box, Typography } from '@mui/material';

interface ProductDescriptionProps {
  description: string;
  details: string[];
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description, details }) => {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Mô tả sản phẩm
      </Typography>
      <Typography variant="body1" paragraph>
        {description}
      </Typography>

      <Typography variant="h6" fontWeight="bold" gutterBottom mt={2}>
        Chi tiết sản phẩm
      </Typography>
      <ul>
        {details.map((detail, index) => (
          <li key={index}>
            <Typography variant="body2">{detail}</Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default ProductDescription;