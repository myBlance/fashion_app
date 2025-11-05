import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ProductCard from '../../components/Client/ProductCard';
import DynamicBreadcrumbs from '../../components/Client/DynamicBreadcrumbs';
import { Product, getProducts } from '../../services/productService';
import { WishlistService } from '../../services/wishlistService';
import { useAuth } from '../../contexts/AuthContext'; // Lấy userId từ context

const WishlistPage: React.FC = () => {
    const { userId } = useAuth(); // User đã đăng nhập
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (!userId) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // 1️⃣ Lấy danh sách productId yêu thích từ database
                const wishlistIds = await WishlistService.getWishlist(userId);

                // 2️⃣ Lấy tất cả sản phẩm từ backend
                const { data } = await getProducts(0, 1000);

                // 3️⃣ Chỉ lấy các sản phẩm có trong wishlist
                const favoriteProducts = data.filter((p) => wishlistIds.includes(p.id));
                setProducts(favoriteProducts);
            } catch (err) {
                console.error('Lỗi khi lấy sản phẩm yêu thích:', err);
                setError('Không thể tải sản phẩm yêu thích.');
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [userId]);

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

            {loading && <Typography variant="body1">Đang tải sản phẩm...</Typography>}

            {!loading && error && (
                <Typography variant="body1" color="error">{error}</Typography>
            )}

            {!loading && !error && products.length === 0 && (
                <Typography variant="body1">Bạn chưa có sản phẩm yêu thích nào.</Typography>
            )}

            {!loading && !error && products.length > 0 && (
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
