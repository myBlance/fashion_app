import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
// ✅ Thay đổi: dùng từ store/hooks thay vì react-redux
import { useAppSelector } from '../../store/hooks';
import { useAppDispatch } from '../../store/hooks';
import ProductCard from '../../components/Client/ProductCard';
import DynamicBreadcrumbs from '../../components/Client/DynamicBreadcrumbs';
import { getProducts } from '../../services/productService';
import { useAuth } from '../../contexts/AuthContext';
import { fetchWishlist } from '../../store/wishlistSlice';
import { Product } from "../../types/Product";

const WishlistPage: React.FC = () => {
    const { userId } = useAuth();
    const dispatch = useAppDispatch(); // ✅ Dùng useAppDispatch
    // ✅ Dùng useAppSelector
    const { items: wishlistIds, loading: wishlistLoading, error: wishlistError } = useAppSelector(
        (state) => state.wishlist
    );
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setProducts([]);
            setLoading(false);
            return;
        }

        // ✅ Fetch wishlist từ Redux store
        dispatch(fetchWishlist(userId));

    }, [userId, dispatch]);

    // ✅ Khi wishlistIds thay đổi (sau khi fetch thành công), cập nhật products
    useEffect(() => {
        const loadProducts = async () => {
            if (!userId || wishlistLoading) return;

            if (wishlistError) {
                setError('Không thể tải sản phẩm yêu thích.');
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
    }, [userId, wishlistIds, wishlistLoading, wishlistError]);

    if (!userId) {
        return (
            <Box p={4}>
                <Typography variant="body1">Vui lòng đăng nhập để xem sản phẩm yêu thích.</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <DynamicBreadcrumbs />

            {(loading || wishlistLoading) && <Typography variant="body1">Đang tải sản phẩm...</Typography>}

            {!loading && !wishlistLoading && error && (
                <Typography variant="body1" color="error">{error}</Typography>
            )}

            {!loading && !wishlistLoading && !error && products.length === 0 && (
                <Typography variant="body1">Bạn chưa có sản phẩm yêu thích nào.</Typography>
            )}

            {!loading && !wishlistLoading && !error && products.length > 0 && (
                <Box
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    }}
                    gap={2}
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default WishlistPage;