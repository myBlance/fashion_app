import { Avatar, Box, Card, Chip, Stack, Typography } from '@mui/material';
import React from 'react';
import { ProductInOrder } from '../../../types/Order';
import { formatCurrency } from '../../../utils/orderHelpers';
import { ProductRating } from '../../Client/Review/ProductRating';

interface ProductItemProps {
    item: ProductInOrder;
    orderId: string;
    orderStatus: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ item, orderId, orderStatus }) => {
    const product = item.product;

    if (!product) {
        return (
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                <Typography variant="body2" color="error">Sản phẩm không tồn tại hoặc đã bị xóa</Typography>
            </Box>
        );
    }

    return (
        <Card variant="outlined" sx={{ mb: 2, display: 'flex', p: 1.5, alignItems: 'center', border: 'none', bgcolor: '#fafafa' }}>
            <Avatar
                src={product.image}
                variant="rounded"
                sx={{ width: 60, height: 60, mr: 2, bgcolor: '#fff', border: '1px solid #eee' }}
            >
                Img
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>{product.name}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">x{item.quantity}</Typography>
                    {item.selectedColor && <Chip label={item.selectedColor} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />}
                    {item.selectedSize && <Chip label={item.selectedSize} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />}
                </Stack>
                <Typography variant="body2" fontWeight="bold" color="primary" sx={{ mt: 0.5 }}>
                    {formatCurrency(product.price)}
                </Typography>
            </Box>

            {orderStatus === 'delivered' && (
                <Box sx={{ minWidth: 120 }}>
                    <ProductRating
                        item={item}
                        orderId={orderId}
                        productId={item.product?.code || item.product?._id || ''}
                    />
                </Box>
            )}
        </Card>
    );
};

export default ProductItem;
