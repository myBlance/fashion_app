import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React from 'react';
import { ReviewService } from '../../../services/reviewService';
import { Product } from '../../../types/Product';

interface ProductComparisonDialogProps {
    open: boolean;
    onClose: () => void;
    products: Product[];
    onRemove: (productId: string) => void;
    wishlistProducts?: Product[];
    onSelect?: (productId: string) => void;
}

const ProductComparisonDialog: React.FC<ProductComparisonDialogProps> = ({
    open,
    onClose,
    products,
    onRemove,
    wishlistProducts = [],
    onSelect
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [ratings, setRatings] = React.useState<Record<string, number>>({});

    // Fetch ratings when products change
    React.useEffect(() => {
        const fetchRatings = async () => {
            console.log('Fetching ratings for:', products.map(p => p.id));
            const newRatings: Record<string, number> = {};
            await Promise.all(products.map(async (p) => {
                try {
                    // Always fetch to ensure fresh data, or optimize as needed
                    // if (ratings[p.id] !== undefined) { ... }

                    const data = await ReviewService.getProductReviews(p._id);
                    console.log(`Rating for ${p.name} (${p._id}):`, data);
                    newRatings[p.id] = data.avgRating || 0;
                } catch (err) {
                    console.error('Failed to fetch rating for', p.id, err);
                    newRatings[p.id] = 0;
                }
            }));
            setRatings(prev => ({ ...prev, ...newRatings }));
        };

        if (products.length > 0 && open) {
            fetchRatings();
        }
    }, [products, open]);

    // Helper to get image URL
    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
            return imagePath;
        }
        return `${API_BASE_URL}/${imagePath}`;
    };

    // Add Product Logic
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleMenuItemClick = (productId: string) => {
        if (onSelect) {
            onSelect(productId);
        }
        handleMenuClose();
    };

    const availableProducts = wishlistProducts.filter(p => !products.some(selected => selected.id === p.id));
    const showAddColumn = products.length < 3 && availableProducts.length > 0;

    if (!products.length && !showAddColumn) return null;

    const columnCount = products.length + (showAddColumn ? 1 : 0);
    const columnWidth = `${100 / (columnCount + 0.8)}%`; // +0.8 for the label column approx

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="lg"
            fullWidth
            scroll="paper"
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                    So sánh sản phẩm ({products.length})
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    {products.length < 3 && (
                        <Button
                            sx={{
                                color: '#b11116',
                                borderColor: '#b11116',
                                '&:hover': {
                                    borderColor: '#8e0e12',
                                    backgroundColor: 'rgba(177, 17, 22, 0.04)'
                                }
                            }}
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddClick}
                        >
                            Thêm sản phẩm
                        </Button>
                    )}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} aria-label="comparison table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '150px', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                    Tính năng
                                </TableCell>
                                {products.map((product) => (
                                    <TableCell key={product.id} align="center" sx={{ width: columnWidth, verticalAlign: 'top' }}>
                                        <Box position="relative">
                                            <IconButton
                                                size="small"
                                                onClick={() => onRemove(product.id)}
                                                sx={{
                                                    position: 'absolute',
                                                    right: -10,
                                                    top: -10,
                                                    zIndex: 10,
                                                    color: '#9e9e9e',
                                                    '&:hover': { color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.04)' }
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                            <Box
                                                component="img"
                                                src={getImageUrl(product.images?.[0] || product.thumbnail)}
                                                alt={product.name}
                                                sx={{ width: '100%', height: 150, objectFit: 'contain', mb: 1 }}
                                            />
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2,
                                                minHeight: '3.2em',
                                                lineHeight: '1.6em' // Fixed line height for consistency
                                            }}>
                                                {product.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                ))}
                                {showAddColumn && (
                                    <TableCell align="center" sx={{ width: columnWidth, verticalAlign: 'middle' }}>
                                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={150}>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={menuOpen}
                                                onClose={handleMenuClose}
                                                PaperProps={{
                                                    style: {
                                                        maxHeight: 300,
                                                        width: '250px',
                                                    },
                                                }}
                                            >
                                                {availableProducts.map((product) => (
                                                    <MenuItem key={product.id} onClick={() => handleMenuItemClick(product.id)}>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Box
                                                                component="img"
                                                                src={getImageUrl(product.images?.[0] || product.thumbnail)}
                                                                sx={{ width: 40, height: 40, objectFit: 'contain' }}
                                                            />
                                                            <Typography variant="body2" noWrap>{product.name}</Typography>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Price Row */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                    Giá bán
                                </TableCell>
                                {products.map((product) => (
                                    <TableCell key={product.id} align="center">
                                        <Typography color="error.main" fontWeight="bold">
                                            {product.price.toLocaleString()}đ
                                        </Typography>
                                        {product.originalPrice > product.price && (
                                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                                {product.originalPrice.toLocaleString()}đ
                                            </Typography>
                                        )}
                                    </TableCell>
                                ))}
                                {showAddColumn && <TableCell />}
                            </TableRow>

                            {/* Rating Row */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                    Đánh giá
                                </TableCell>
                                {products.map((product) => (
                                    <TableCell key={product.id} align="center">
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <Rating value={ratings[product.id] || 0} readOnly precision={0.5} size="small" />
                                            <Typography variant="caption" ml={0.5}>
                                                ({ratings[product.id] || 0})
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                ))}
                                {showAddColumn && <TableCell />}
                            </TableRow>

                            {/* Brand Row */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                    Thương hiệu
                                </TableCell>
                                {products.map((product) => (
                                    <TableCell key={product.id} align="center">
                                        {product.brand || 'Chưa cập nhật'}
                                    </TableCell>
                                ))}
                                {showAddColumn && <TableCell />}
                            </TableRow>

                            {/* Status Row */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                    Tình trạng
                                </TableCell>
                                {products.map((product) => (
                                    <TableCell key={product.id} align="center">
                                        <Typography
                                            variant="body2"
                                            color={(product.total - product.sold) > 0 ? 'success.main' : 'error.main'}
                                        >
                                            {(product.total - product.sold) > 0 ? 'Còn hàng' : 'Hết hàng'}
                                        </Typography>
                                    </TableCell>
                                ))}
                                {showAddColumn && <TableCell />}
                            </TableRow>

                            {/* Colors Row */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                    Màu sắc
                                </TableCell>
                                {products.map((product) => (
                                    <TableCell key={product.id} align="center">
                                        <Box display="flex" justifyContent="center" gap={0.5} flexWrap="wrap">
                                            {product.colors && product.colors.length > 0 ? product.colors.map((color, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        backgroundColor: color,
                                                        borderRadius: '50%',
                                                        border: '1px solid #e0e0e0',
                                                        display: 'inline-block'
                                                    }}
                                                    title={color}
                                                />
                                            )) : 'Không có'}
                                        </Box>
                                    </TableCell>
                                ))}
                                {showAddColumn && <TableCell />}
                            </TableRow>

                            {/* Sizes Row */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                    Kích thước
                                </TableCell>
                                {products.map((product) => (
                                    <TableCell key={product.id} align="center">
                                        {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'Không có'}
                                    </TableCell>
                                ))}
                                {showAddColumn && <TableCell />}
                            </TableRow>

                            {/* Description Row (Truncated) */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                    Mô tả
                                </TableCell>
                                {products.map((product) => (
                                    <TableCell key={product.id} align="center">
                                        <Typography variant="body2" sx={{
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 4,
                                        }}>
                                            {product.description || 'Không có mô tả'}
                                        </Typography>
                                    </TableCell>
                                ))}
                                {showAddColumn && <TableCell />}
                            </TableRow>

                            {/* Dynamic Detail Rows */}
                            {(() => {
                                const parseDetails = (details: string | undefined): Record<string, string> => {
                                    if (!details) return {};
                                    const lines = details.split('\n');
                                    const result: Record<string, string> = {};
                                    lines.forEach(line => {
                                        let cleaned = line.trim();
                                        if (cleaned.startsWith('-') || cleaned.startsWith('•') || cleaned.startsWith('+')) {
                                            cleaned = cleaned.substring(1).trim();
                                        }
                                        const parts = cleaned.split(':');
                                        if (parts.length >= 2) {
                                            const key = parts[0].trim();
                                            const value = parts.slice(1).join(':').trim();
                                            if (key && value) {
                                                // Normalize keys
                                                let normalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

                                                // Map common variations to standard keys
                                                const keyMap: Record<string, string> = {
                                                    'Màu': 'Màu sắc',
                                                    'Color': 'Màu sắc',
                                                    'Colour': 'Màu sắc',
                                                    'Size': 'Kích thước',
                                                    'Kích cỡ': 'Kích thước',
                                                    'Material': 'Chất liệu',
                                                    'Chất vải': 'Chất liệu'
                                                };

                                                if (keyMap[normalizedKey]) {
                                                    normalizedKey = keyMap[normalizedKey];
                                                }

                                                // If the key is 'Màu sắc' or 'Kích thước', we might want to skip it if it's redundant with static rows,
                                                // but user asked to merge them, implying they want to see the text. 
                                                // However, we must ensure we don't have multiple 'Màu sắc' rows if the product has both 'Màu' and 'Màu sắc' keys.
                                                // The logic below result[normalizedKey] = value will overwrite. 
                                                // If we want to keep both values, we should append.
                                                if (result[normalizedKey]) {
                                                    result[normalizedKey] += `, ${value}`;
                                                } else {
                                                    result[normalizedKey] = value;
                                                }
                                            }
                                        }
                                    });
                                    return result;
                                };

                                const excludedKeys = ['Màu sắc', 'Kích thước', 'Thương hiệu', 'Tình trạng', 'Mô tả', 'Giá'];
                                const allKeys = Array.from(new Set(
                                    products.flatMap(p => Object.keys(parseDetails(p.details)))
                                )).filter(key => !excludedKeys.includes(key));

                                if (allKeys.length === 0) {
                                    // Fallback if no keys found (unstructured text)
                                    return (
                                        <TableRow>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                                Chi tiết sản phẩm
                                            </TableCell>
                                            {products.map((product) => (
                                                <TableCell key={product.id} align="left" sx={{ verticalAlign: 'top' }}>
                                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                                                        {product.details || 'Chưa cập nhật'}
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                            {showAddColumn && <TableCell />}
                                        </TableRow>
                                    );
                                }

                                return allKeys.map(key => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                            {key}
                                        </TableCell>
                                        {products.map((product) => {
                                            const detailsMap = parseDetails(product.details);
                                            return (
                                                <TableCell key={product.id} align="center">
                                                    {detailsMap[key] || '-'}
                                                </TableCell>
                                            );
                                        })}
                                        {showAddColumn && <TableCell />}
                                    </TableRow>
                                ));
                            })()}

                            {/* Action Row */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                </TableCell>
                                {products.map((product) => (
                                    <TableCell key={product.id} align="center">
                                        <Button
                                            variant="contained"
                                            href={`/product/${product.id}`}
                                            fullWidth
                                            size="small"
                                            sx={{
                                                bgcolor: '#b11116',
                                                '&:hover': { bgcolor: '#8e0e12' }
                                            }}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                ))}
                                {showAddColumn && <TableCell />}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

export default ProductComparisonDialog;
