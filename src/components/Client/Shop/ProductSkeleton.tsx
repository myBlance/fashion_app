import { Box, Skeleton } from '@mui/material';
import React from 'react';

interface ProductSkeletonProps {
    count?: number;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <Box key={index}>
                    <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
                    <Skeleton width="80%" height={30} sx={{ mt: 1 }} />
                    <Skeleton width="50%" height={24} />
                </Box>
            ))}
        </>
    );
};

export default ProductSkeleton;
