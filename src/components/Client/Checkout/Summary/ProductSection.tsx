import { Box, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import translateColor from '../../../../utils/colorTranslation';

interface CartItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
}

interface ProductSectionProps {
    cartItems: CartItem[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ cartItems }) => {

    return (
        <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2} sx={{ textAlign: 'left' }}>
                Sản phẩm ({cartItems.length})
            </Typography>
            <Stack spacing={2}>
                {cartItems.map((item, index) => (
                    <Box key={index} display="flex" gap={2} alignItems="flex-start">
                        {/* Image */}
                        <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid #f0f0f0'
                            }}
                        />

                        {/* Details */}
                        <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight="600" sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mb: 0.5,
                                textAlign: 'left'
                            }}>
                                {item.name}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} color="text.secondary" fontSize="0.875rem" mb={0.5}>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    Phân loại: {translateColor(item.color)} / {item.size}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    x{item.quantity}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#ef3636ff', fontSize: '1.2rem' }}>
                                    {(item.price * item.quantity).toLocaleString()}₫
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};

export default ProductSection;
