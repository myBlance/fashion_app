import { Avatar, Box, Card, Chip, Stack, Typography } from '@mui/material';
import React from 'react';
import { ProductInOrder } from '../../../types/Order';
import { getColorHex, getColorLabel } from '../../../utils/colorHelper';
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

    // Aggressive Path Normalization
    const getFinalImageUrl = (raw: any) => {
        if (!raw) return '/no-image.png';

        let url = raw;

        // 1. Handle Object
        if (typeof url === 'object') {
            url = url.path || url.url || '';
        }

        // 2. Handle Array (take first)
        if (Array.isArray(url)) {
            url = url.length > 0 ? url[0] : '';
        }

        if (typeof url !== 'string' || !url) return '/no-image.png';

        // 3. Check for absolute URL
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        // 4. Normalize slashes
        url = url.replace(/\\/g, '/');

        // 5. Remove leading slashes and 'uploads/' prefix to avoid duplication
        // regex removes: "/" at start, or "uploads/" at start, repeated
        url = url.replace(/^(\/|uploads\/)+/, '');

        // 6. Construct full URL
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''; // Remove trailing slash from base
        return `${baseUrl}/uploads/${url}`;
    };

    const finalSrc = getFinalImageUrl(product.thumbnail || product.image);

    return (
        <Card variant="outlined" sx={{ mb: 2, display: 'flex', p: 1.5, alignItems: 'center', border: 'none', bgcolor: '#fafafa' }}>
            <Avatar
                src={finalSrc}
                variant="rounded"
                sx={{ width: 60, height: 60, mr: 2, bgcolor: '#fff', border: '1px solid #eee' }}
            >
                <Box
                    component="img"
                    src="/no-image.png"
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.5 }}
                />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>{product.name}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">x{item.quantity}</Typography>
                    {item.selectedColor && (
                        <Chip
                            avatar={
                                <Box
                                    sx={{
                                        bgcolor: getColorHex(item.selectedColor),
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        border: '1px solid rgba(0,0,0,0.1)'
                                    }}
                                />
                            }
                            label={`Màu: ${getColorLabel(item.selectedColor)}`}
                            size="small"
                            sx={{ height: 24, fontSize: '0.75rem', pl: 0.5 }}
                        />
                    )}
                    {item.selectedSize && <Chip label={`Size: ${item.selectedSize}`} size="small" sx={{ height: 24, fontSize: '0.75rem' }} />}
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
