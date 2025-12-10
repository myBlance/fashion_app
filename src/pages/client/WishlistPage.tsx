import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Button, Container, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Thay đổi: dùng từ store/hooks thay vì react-redux
import DynamicBreadcrumbs from '../../components/Client/Breadcrumb/DynamicBreadcrumbs';
import ProductCard from '../../components/Client/Productcard/ProductCard';
import { useAuth } from '../../contexts/AuthContext';
import { getProducts } from '../../services/productService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchWishlist, loadGuestWishlist } from '../../store/wishlistSlice';
import { Product } from "../../types/Product";

const WishlistPage: React.FC = () => {
    const { userId } = useAuth();
    const dispatch = useAppDispatch(); // ✅ Dùng useAppDispatch
    const navigate = useNavigate();

    // ✅ Dùng useAppSelector
    const { items: wishlistIds, loading: wishlistLoading, error: wishlistError } = useAppSelector(
        (state) => state.wishlist
    );
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    // ✅ Sử dụng useMemo để tạo stable string từ wishlistIds
    const wishlistIdsStr = useMemo(() => wishlistIds.join(','), [wishlistIds.length, wishlistIds.join(',')]);

    useEffect(() => {
        if (userId) {
            // ✅ Fetch wishlist từ Redux store cho logged-in users
            dispatch(fetchWishlist(userId));
        } else {
            // Load guest wishlist from localStorage
            dispatch(loadGuestWishlist());
        }
    }, [userId, dispatch]);

    // ✅ Khi wishlistIds thay đổi (sau khi fetch thành công), cập nhật products
    useEffect(() => {
        const loadProducts = async () => {
            // ✅ Chỉ load khi không đang loading và không có error
            if (wishlistLoading) return;

            if (wishlistError) {
                setError('Không thể tải sản phẩm yêu thích.');
                setLoading(false);
                return;
            }

            // ✅ Nếu wishlist rỗng, set products rỗng ngay và return
            if (wishlistIds.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // 1️⃣ Lấy tất cả sản phẩm
                const { data } = await getProducts(0, 1000);

                // 2️⃣ Lọc theo danh sách yêu thích từ Redux
                const favoriteProducts = data.filter((p) => wishlistIds.includes(p.id));
                setProducts(favoriteProducts);
            } catch (err) {
                console.error('Lỗi khi lấy sản phẩm:', err);
                setError('Không thể tải danh sách sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
        // ✅ Dùng stable string từ useMemo thay vì JSON.stringify trực tiếp
    }, [wishlistIdsStr, wishlistLoading, wishlistError]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <DynamicBreadcrumbs />

            <Box mb={4} mt={2}>
                <Typography variant="h4" fontWeight="bold" color="#d32f2f" textAlign={{ xs: 'center', md: 'left' }}>
                    Sản phẩm yêu thích
                </Typography>
                <Box sx={{ width: 60, height: 4, bgcolor: '#d32f2f', mt: 1, mx: { xs: 'auto', md: 0 }, borderRadius: 1 }} />
            </Box>

            {(loading || wishlistLoading) && (
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

            {!loading && !wishlistLoading && error && (
                <Typography variant="body1" color="error" textAlign="center">{error}</Typography>
            )}

            {!loading && !wishlistLoading && !error && products.length === 0 && (
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

            {!loading && !wishlistLoading && !error && products.length > 0 && (
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