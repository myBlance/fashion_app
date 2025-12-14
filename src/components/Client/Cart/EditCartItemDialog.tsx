import { Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import * as ProductService from '../../../services/productService';
import { CartItem } from '../../../types/CartItem';
import { Product } from '../../../types/Product';

interface EditCartItemDialogProps {
    open: boolean;
    onClose: () => void;
    item: CartItem | null;
    onSave: (oldColor: string, oldSize: string, newColor: string, newSize: string) => Promise<void>;
}

const EditCartItemDialog: React.FC<EditCartItemDialogProps> = ({ open, onClose, item, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && item) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    // Fetch product details to get available colors/sizes
                    const data = await ProductService.getProductById(item.productId);
                    setProduct(data);
                    setSelectedColor(item.color || '');
                    setSelectedSize(item.size || '');
                } catch (error) {
                    console.error('Failed to fetch product details', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [open, item]);

    const handleSave = async () => {
        if (!item) return;
        if (selectedColor === item.color && selectedSize === item.size) {
            onClose();
            return;
        }

        setSaving(true);
        try {
            await onSave(item.color || '', item.size || '', selectedColor, selectedSize);
            onClose();
        } catch (error) {
            console.error('Failed to update variant', error);
        } finally {
            setSaving(false);
        }
    };

    if (!item) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Đổi phân loại hàng</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <CircularProgress />
                    </div>
                ) : product ? (
                    <Stack spacing={3}>
                        {/* Product Info */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }} />
                            <div>
                                <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Hiện tại: {item.color}, {item.size}
                                </Typography>
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <Typography variant="subtitle2" gutterBottom>Màu sắc</Typography>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {product.colors && product.colors.length > 0 ? (
                                    product.colors.map((c) => (
                                        <Chip
                                            key={c}
                                            label={c}
                                            clickable
                                            color={selectedColor === c ? 'primary' : 'default'}
                                            variant={selectedColor === c ? 'filled' : 'outlined'}
                                            onClick={() => setSelectedColor(c)}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">Không có lựa chọn màu</Typography>
                                )}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <Typography variant="subtitle2" gutterBottom>Kích thước</Typography>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {product.sizes && product.sizes.length > 0 ? (
                                    product.sizes.map((s) => (
                                        <Chip
                                            key={s}
                                            label={s}
                                            clickable
                                            color={selectedSize === s ? 'primary' : 'default'}
                                            variant={selectedSize === s ? 'filled' : 'outlined'}
                                            onClick={() => setSelectedSize(s)}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">Không có lựa chọn size</Typography>
                                )}
                            </div>
                        </div>

                    </Stack>
                ) : (
                    <Typography color="error">Không tải được thông tin sản phẩm.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Hủy</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving || loading}>
                    {saving ? 'Đang lưu...' : 'Xác nhận'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCartItemDialog;
