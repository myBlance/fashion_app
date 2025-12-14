import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Button, Container, Skeleton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Thay đổi: dùng từ store/hooks thay vì react-redux
import PageHeader from '../../components/Client/Common/PageHeader';
import ProductCard from '../../components/Client/Productcard/ProductCard';
import { useAuth } from '../../contexts/AuthContext';
import { getProducts } from '../../services/productService';
import { WishlistService } from '../../services/wishlistService';
import { Product } from "../../types/Product";

const WishlistPage: React.FC = () => {
    const { userId } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    // Single useEffect to handle everything
    useEffect(() => {
        let isCancelled = false;

        const fetchAndLoadProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Step 1: Fetch wishlist
                let fetchedWishlistIds: string[] = [];
                if (userId) {
                    // For logged-in users, fetch from API
                    const wishlistData = await WishlistService.getWishlist(userId);
                    fetchedWishlistIds = wishlistData;
                } else {
                    // For guest users, get directly from localStorage
                    const { getLocalWishlist } = await import('../../utils/wishlistStorage');
                    fetchedWishlistIds = getLocalWishlist();
                }

                if (isCancelled) return;

                // Step 2: If empty, set empty products
                if (fetchedWishlistIds.length === 0) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                // Step 3: Fetch all products and filter
                const { data } = await getProducts(0, 1000);
                if (isCancelled) return;

                const favoriteProducts = data.filter((p) => fetchedWishlistIds.includes(p.id));
                setProducts(favoriteProducts);
            } catch (err) {
                if (!isCancelled) {
                    console.error('Lỗi khi tải wishlist:', err);
                    setError('Không thể tải danh sách sản phẩm yêu thích.');
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchAndLoadProducts();

        return () => {
            isCancelled = true;
        };
    }, [userId]); // Only depend on userId - this prevents infinite loop!

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <PageHeader title="Sản phẩm yêu thích" />

            {loading && (
                <Box
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    }}
                    gap={3}
                >
                    {[...Array(4)].map((_, index) => (
                        <Box key={index}>
                            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
                            <Skeleton width="80%" height={30} sx={{ mt: 1 }} />
                            <Skeleton width="50%" height={24} />
                        </Box>
                    ))}
                </Box>
            )}

            {!loading && error && (
                <Typography variant="body1" color="error" textAlign="center">{error}</Typography>
            )}

            {!loading && !error && products.length === 0 && (
                <Box textAlign="center" py={8}>
                    <FavoriteBorderIcon sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Danh sách yêu thích của bạn đang trống
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Hãy thêm những sản phẩm bạn yêu thích vào đây để xem lại sau nhé!
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => navigate('/shop')}
                        sx={{ px: 4, py: 1.2, borderRadius: 2 }}
                    >
                        Tiếp tục mua sắm
                    </Button>
                </Box>
            )}

            {!loading && !error && products.length > 0 && (
                <Box
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(2, 1fr)', // Changed to 2 columns on mobile for better visibility
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    }}
                    gap={3}
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default WishlistPage;