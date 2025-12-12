import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

interface ProductGridProps {
    children: ReactNode;
}

const ProductGrid: React.FC<ProductGridProps> = ({ children }) => {
    return (
        <Box
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
            }}
            gap={3}
        >
            {children}
        </Box>
    );
};

export default ProductGrid;
