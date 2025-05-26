import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    IconButton,
    Chip,
    LinearProgress,
    Button,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleWishlist } from '../../store/wishlistSlice';
import { Product } from '../../data/products';
import QuickView from '../Client/QuickView'; 

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const wishlist = useAppSelector((state) => state.wishlist.items);
    const isFavorite = wishlist.includes(product.id);

    const [hovered, setHovered] = useState(false);
    const soldPercentage = (product.sold / product.total) * 100;

    const displayedImage = hovered ? product.images[1] || product.images[0] : product.images[0];

    const handleClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(toggleWishlist(product.id));
    };

  // Xem nhanh (popup/modal)
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleOpenQuickView = (product: Product) => {
        setSelectedProduct(product);
        setQuickViewOpen(true);
    };

    const handleCloseQuickView = () => {
        setQuickViewOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className='card-container'>
            <Card
                sx={{
                width: 220,
                position: 'relative',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { boxShadow: 6 },
                    overflow: 'visible',
                }}
                    onClick={handleClick}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
            >
                {product.originalPrice > product.price && (
                    <Chip
                        label={`-${Math.round(
                            ((product.originalPrice - product.price) / product.originalPrice) * 100
                        )}%`}
                            color="error"
                            size="small"
                            sx={{ position: 'absolute', top: 8, left: 8, zIndex: 3 }}
                    />
                )}

                <IconButton
                    onClick={handleToggleWishlist}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 3,
                        backgroundColor: 'white',
                        '&:hover': {
                        backgroundColor: '#fce4ec',
                        },
                    }}
                >
                    {isFavorite ? (
                        <Favorite sx={{ color: '#e91e63' }} />
                    ) : (
                        <FavoriteBorder sx={{ color: '#999' }} />
                    )}
                </IconButton>

                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="260"
                        image={displayedImage}
                        alt={product.name}
                        sx={{ transition: '0.3s' }}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        style={{ userSelect: 'none' }}
                    />
                {product.sale && (
                    <Chip
                        label="Khuyến mãi đặc biệt"
                        color="warning"
                        size="small"
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            zIndex: 3,
                            bgcolor: 'warning.main',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                     />
                )}

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            zIndex: 4,
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'opacity 0.3s ease, transform 0.3s ease',
                            pointerEvents: hovered ? 'auto' : 'none',
                        }}
                    >
                        <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            Xem chi tiết
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenQuickView(product);
                            }}
                            sx={{
                                color: '#000',
                                borderColor: '#000',
                                '&:hover': { borderColor: '#000', bgcolor: 'rgba(255,255,255,0.2)' },
                            }}
                        >
                            Xem nhanh
                        </Button>
                    </Box>
                </Box>

                <CardContent>
                
                    <Typography variant="body1" fontWeight="bold">
                        {product.name.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="error" fontWeight="bold">
                        {product.price.toLocaleString()}đ{' '}
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ textDecoration: 'line-through', color: '#999' }}
                            >
                                {product.originalPrice.toLocaleString()}đ
                            </Typography>
                        </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {product.colors.map((color, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: color,
                                border: '1px solid #ccc',
                                }}
                            />
                        ))}
                    </Box>
                <Box mt={1}>
                <LinearProgress variant="determinate" value={soldPercentage} />
                    <Typography variant="caption">
                        Đã bán {product.sold}
                    </Typography>
                </Box>

                </CardContent>
            </Card>

            {selectedProduct && (
                <QuickView 
                    open={quickViewOpen} 
                    onClose={handleCloseQuickView} 
                    product={selectedProduct} />
            )}
        </div>
    );
};

export default ProductCard;
