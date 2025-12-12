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
import PageHeader from '../../components/Client/Common/PageHeader';
import '../../styles/BlogPage.css';

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
        <Container maxWidth="lg" className="blog-page-container">
            <PageHeader title="Tin tức" />
            <Box display="flex" flexWrap="wrap" gap={4}>
                {/* Main Content Column */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '3' } }}>
                    {/* Featured Banner */}
                    <Paper elevation={0} className="blog-featured-banner">
                        <Box className="blog-featured-title-box">
                            <Typography variant="h5" color="white" fontWeight="bold" textTransform="uppercase">
                                Tin mới nhất
                            </Typography>
                        </Box>
                        <Box className="blog-featured-content">
                            {/* Simulated Slider Arrows */}
                            <Box component="span" className="blog-slider-arrow left"><ArrowBackIosIcon /></Box>

                            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="center">
                                <Box sx={{ width: { xs: '100%', md: '41.6%' } }}>
                                    <Box
                                        component="img"
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="blog-featured-image"
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

                            <Box component="span" className="blog-slider-arrow right"><ArrowForwardIosIcon /></Box>
                        </Box>
                    </Paper>

                    <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
                        Tin tức
                    </Typography>

                    {/* Blog Grid */}
                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={3}>
                        {blogPosts.map((post) => (
                            <Box key={post.id}>
                                <Card className="blog-post-card">
                                    <Box className="blog-post-image-box">
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={post.image}
                                            alt={post.title}
                                            onError={(e: any) => { e.target.src = 'https://placehold.co/600x400'; }}
                                            className="blog-post-card-media"
                                        />
                                    </Box>
                                    <CardContent sx={{ px: 0, flexGrow: 1 }}>
                                        <Box width={40} height={2} bgcolor="#eee" mb={1}></Box> {/* Decorative Line */}
                                        <Typography gutterBottom variant="h6" component="div" className="blog-post-title">
                                            {post.title}
                                        </Typography>
                                        <Typography variant="caption" color="error" display="block" mb={1}>
                                            {post.date}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="blog-post-desc">
                                            {post.description}
                                        </Typography>
                                        <Button size="small" className="blog-read-more-btn">
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
                        <Box className="blog-sidebar-category-header">
                            <Typography variant="h6" color="white" fontWeight="bold">
                                Danh mục tin tức
                            </Typography>
                        </Box>
                        <Paper elevation={0} className="blog-sidebar-list-paper">
                            <List disablePadding>
                                {categories.map((cat, index) => (
                                    <ListItem key={index} divider={index !== categories.length - 1} className="blog-sidebar-list-item">
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
                                    <Box className="blog-sidebar-popular-badge" sx={{ bgcolor: index === 0 ? '#fdd835' : '#eee', color: index === 0 ? 'white' : '#666' }}>
                                        {index + 1}
                                    </Box>

                                    <Box flexShrink={0} width={80} height={60}>
                                        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                                            onError={(e: any) => { e.target.src = 'https://placehold.co/100x100'; }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold" className="blog-popular-title">
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
