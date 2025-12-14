import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ProductService from '../../../services/productService';
import '../../../styles/EditCartItemDialog.css';
import { CartItem } from '../../../types/CartItem';
import { Product } from '../../../types/Product';
import { translateColor } from '../../../utils/colorTranslation';

interface EditCartItemDialogProps {
    open: boolean;
    onClose: () => void;
    item: CartItem | null;
    onSave: (oldColor: string, oldSize: string, newColor: string, newSize: string) => Promise<void>;
}

const EditCartItemDialog: React.FC<EditCartItemDialogProps> = ({ open, onClose, item, onSave }) => {
    const navigate = useNavigate();
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
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                                onClick={() => navigate(`/product/${item.productId}`)}
                                title="Xem chi tiết sản phẩm"
                            />
                            <div>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    sx={{ cursor: 'pointer', '&:hover': { color: '#007bff' } }}
                                    onClick={() => navigate(`/product/${item.productId}`)}
                                    title="Xem chi tiết sản phẩm"
                                >
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Hiện tại: {translateColor(item.color ?? '')}, {item.size}
                                </Typography>
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <Typography variant="subtitle2" gutterBottom>
                                Màu sắc: <span style={{ fontWeight: 400, color: '#666' }}>{translateColor(selectedColor)}</span>
                            </Typography>
                            <div className="color-list-dialog">
                                {product.colors && product.colors.length > 0 ? (
                                    product.colors.map((c) => (
                                        <div
                                            key={c}
                                            className={`color-item-dialog ${selectedColor === c ? 'selected' : ''}`}
                                            onClick={() => setSelectedColor(c)}
                                            title={translateColor(c)}
                                        >
                                            <div style={{ backgroundColor: c }} className="color-circle-dialog" />
                                        </div>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">Không có lựa chọn màu</Typography>
                                )}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <Typography variant="subtitle2" gutterBottom>
                                Kích thước: <span style={{ fontWeight: 400, color: '#666' }}>{selectedSize}</span>
                            </Typography>
                            <div className="size-list-dialog">
                                {product.sizes && product.sizes.length > 0 ? (
                                    product.sizes.map((s) => (
                                        <button
                                            key={s}
                                            className={`size-btn-dialog ${selectedSize === s ? 'selected' : ''}`}
                                            onClick={() => setSelectedSize(s)}
                                        >
                                            {s}
                                        </button>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">Không có lựa chọn size</Typography>
                                )}
                            </div>
                        </div>

                        {/* Stock Availability */}
                        {selectedColor && selectedSize && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                marginTop: '8px'
                            }}>
                                {(() => {
                                    const currentVariant = product.variants?.find(
                                        v => v.color === selectedColor && v.size === selectedSize
                                    );
                                    const stock = currentVariant ? currentVariant.quantity : 0;
                                    const isAvailable = stock > 0;

                                    return (
                                        <Typography
                                            variant="body2"
                                            style={{
                                                color: isAvailable ? '#4caf50' : '#f44336',
                                                fontWeight: 600
                                            }}
                                        >
                                            {isAvailable
                                                ? `Còn hàng (${stock} sản phẩm)`
                                                : `Hết hàng`}
                                        </Typography>
                                    );
                                })()}
                            </div>
                        )}

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
