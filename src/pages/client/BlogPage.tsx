import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import React from 'react';

// Mock Data
const featuredPost = {
    title: '"Nữ nhân viên mát-xa" trong phim Trấn Thành ngoài đời xinh như hoa, không hở bạo vẫn đẹp hút hồn',
    date: '21/02/2024',
    description: 'Vào vai "Diễm mát-xa", Anh Phạm ở đời thường được đánh giá xinh đẹp và rực rỡ hơn hẳn so với khi lên phim. Phim điện ảnh Mai của Trấn Thành hiện là chủ đề được bàn tán rôm rả. Ngoài hai nhân vật chính là Phương Anh Đào...',
    image: '/assets/images/1708274021-351-thumbnail-width64.webp',
};

const blogPosts = [
    {
        id: 1,
        title: '7 món thời trang không bao giờ là cũ, chị em mặc quanh năm vẫn đẹp sang',
        date: '21/02/2024',
        image: '/assets/images/1707844303-687-thumbnail-width64.webp',
        description: 'Những món đồ cơ bản không bao giờ là cũ như áo thun trắng, quần jean ống đứng, tất dài, giày lười, thắt lưng... sẽ có sức sống lâu bền...',
    },
    {
        id: 2,
        title: '"Nữ nhân viên mát-xa" trong phim Trấn Thành ngoài đời xinh như hoa, không...',
        date: '21/02/2024',
        image: '/assets/images/1708270020-489-local.webp',
        description: 'Vào vai "Diễm mát-xa", Anh Phạm ở đời thường được đánh giá xinh đẹp và rực rỡ hơn hẳn so với khi lên phim. Phim điện ảnh Mai của Trấn Thành...',
    },
    {
        id: 3,
        title: 'Tuần này mặc gì: Học theo quý cô Anh Quốc công thức phối đồ đẹp kinh điển...',
        date: '21/02/2024',
        image: '/assets/images/1708314149-196-local.webp',
        description: 'Sang trọng, thu hút mà không cần chạy theo bất kỳ trend nào - đây chính là những gì mà tủ đồ của các cô nàng Anh Quốc luôn chú...',
    },
    {
        id: 4,
        title: 'Tủ quần áo con nhộng là gì? Chìa khóa mặc đẹp, tiết kiệm mà phụ nữ hiện...',
        date: '21/02/2024',
        image: '/assets/images/1708315443-287-local.webp',
        description: 'Tủ quần áo con nhộng là gì? ...',
    },
];

const categories = [
    'Trang chủ',
    'Giới thiệu',
    'Sản phẩm',
    'Tin tức',
    'Flash sale đồng giá',
    'Instagram',
    'Câu hỏi thường gặp',
    'Liên hệ',
];

const popularPosts = [
    { id: 1, title: '7 món thời trang không bao giờ là cũ, chị em mặc quanh năm vẫn đẹp sang', date: '21/02/2024', image: '/assets/images/1707844303-687-thumbnail-width64.webp' },
    { id: 2, title: '"Nữ nhân viên mát-xa" trong phim Trấn Thành ngoài đời xinh như hoa...', date: '21/02/2024', image: '/assets/images/1708274021-351-thumbnail-width64.webp' },
    { id: 3, title: 'Tuần này mặc gì: Học theo quý cô Anh Quốc công thức phối đồ đẹp...', date: '21/02/2024', image: '/assets/images/1708314149-196-local.webp' },
    { id: 4, title: 'Tủ quần áo con nhộng là gì? Chìa khóa mặc đẹp, tiết kiệm mà phụ...', date: '21/02/2024', image: '/assets/images/1708315443-287-local.webp' },
];


const BlogPage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>


            <Box display="flex" flexWrap="wrap" gap={4}>
                {/* Main Content Column */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '3' } }}>
                    {/* Featured Banner */}
                    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0, overflow: 'hidden', mb: 6 }}>
                        <Box bgcolor="#b71c1c" p={2} textAlign="center">
                            <Typography variant="h5" color="white" fontWeight="bold" textTransform="uppercase">
                                Tin mới nhất
                            </Typography>
                        </Box>
                        <Box p={3} display="flex" alignItems="center">
                            {/* Simulated Slider Arrows */}
                            <Box component="span" sx={{ cursor: 'pointer', color: '#ccc', mr: 2 }}><ArrowBackIosIcon /></Box>

                            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="center">
                                <Box sx={{ width: { xs: '100%', md: '41.6%' } }}>
                                    <Box
                                        component="img"
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        sx={{ width: '100%', borderRadius: 2, maxHeight: 250, objectFit: 'cover' }}
                                        onError={(e: any) => { e.target.src = 'https://placehold.co/600x400'; }}
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {featuredPost.title}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1} mb={1} color="text.secondary" fontSize="0.875rem">
                                        <AccessTimeIcon fontSize="small" /> {featuredPost.date}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {featuredPost.description}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box component="span" sx={{ cursor: 'pointer', color: '#b71c1c', ml: 2 }}><ArrowForwardIosIcon /></Box>
                        </Box>
                    </Paper>

                    <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
                        Tin tức
                    </Typography>

                    {/* Blog Grid */}
                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={3}>
                        {blogPosts.map((post) => (
                            <Box key={post.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 'none', border: 'none' }}>
                                    <Box sx={{ overflow: 'hidden', borderRadius: 2 }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={post.image}
                                            alt={post.title}
                                            onError={(e: any) => { e.target.src = 'https://placehold.co/600x400'; }}
                                            sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
                                        />
                                    </Box>
                                    <CardContent sx={{ px: 0, flexGrow: 1 }}>
                                        <Box width={40} height={2} bgcolor="#eee" mb={1}></Box> {/* Decorative Line */}
                                        <Typography gutterBottom variant="h6" component="div" fontSize="1rem" fontWeight="bold" sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2, // Limit to 2 lines
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {post.title}
                                        </Typography>
                                        <Typography variant="caption" color="error" display="block" mb={1}>
                                            {post.date}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3, // Limit to 3 lines
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {post.description}
                                        </Typography>
                                        <Button size="small" sx={{ color: '#b71c1c', mt: 1, padding: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                                            Đọc tiếp &gt;
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Sidebar Column */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1' } }}>
                    {/* Categories */}
                    <Box mb={4}>
                        <Box bgcolor="#b71c1c" p={1.5} borderRadius="4px 4px 0 0">
                            <Typography variant="h6" color="white" fontWeight="bold">
                                Danh mục tin tức
                            </Typography>
                        </Box>
                        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '0 0 4px 4px', p: 0 }}>
                            <List disablePadding>
                                {categories.map((cat, index) => (
                                    <ListItem key={index} divider={index !== categories.length - 1} sx={{ '&:hover': { color: '#b71c1c', cursor: 'pointer' } }}>
                                        <ListItemText primary={cat} primaryTypographyProps={{ fontSize: '0.95rem' }} />
                                        {cat === 'Sản phẩm' && <Typography variant="caption">+</Typography>}
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Box>

                    {/* Popular News */}
                    <Box>
                        <Typography variant="h6" fontWeight="bold" color="#b71c1c" mb={2}>
                            Tin tức nổi bật
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {popularPosts.map((post, index) => (
                                <Box key={post.id} display="flex" gap={2}>
                                    {/* Number Badge */}
                                    <Box sx={{
                                        minWidth: 24, height: 24, borderRadius: '50%', bgcolor: index === 0 ? '#fdd835' : '#eee', color: index === 0 ? 'white' : '#666',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', zIndex: 1, mt: 1
                                    }}>
                                        {index + 1}
                                    </Box>

                                    <Box flexShrink={0} width={80} height={60}>
                                        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                                            onError={(e: any) => { e.target.src = 'https://placehold.co/100x100'; }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold" sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: 1.3
                                        }}>
                                            {post.title}
                                        </Typography>
                                        <Typography variant="caption" color="error">
                                            {post.date}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default BlogPage;
