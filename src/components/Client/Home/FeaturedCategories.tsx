import { Box, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Áo', image: '/assets/icons/icon1.webp' },
  { name: 'Quần', image: '/assets/icons/icon2.webp' },
  { name: 'Váy', image: '/assets/icons/icon3.webp' },
  { name: 'Đầm', image: '/assets/icons/icon4.webp' },
  { name: 'Quần jeans', image: '/assets/icons/icon5.webp' },
  { name: 'Áo len', image: '/assets/icons/icon6.webp' },
  { name: 'Áo nỉ', image: '/assets/icons/icon7.webp' },
];

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?type=${encodeURIComponent(categoryName)}`);
  };

  return (
    <Box sx={{ my: 6, px: { xs: 2, md: 0 } }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          mb: 5,
          textAlign: 'center',
          fontSize: { xs: '1.8rem', md: '2.5rem' },
          textTransform: 'uppercase',
          letterSpacing: 2,
          color: 'text.primary'
        }}
      >
        Danh mục nổi bật
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(4, 1fr)',
          md: 'repeat(7, 1fr)'
        }}
        gap={3}
        sx={{
          justifyContent: 'center',
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        {categories.map((type, index) => (
          <Box
            key={index}
            onClick={() => handleCategoryClick(type.name)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                '& .category-img': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                },
                '& .category-name': {
                  color: theme.palette.primary.main
                }
              }
            }}
          >
            <Box
              className="category-img"
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #eee',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#fff',
                transition: 'all 0.3s ease'
              }}
            >
              <Box
                component="img"
                src={type.image}
                alt={type.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Typography
              className="category-name"
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                textAlign: 'center',
                transition: 'color 0.3s ease',
                fontSize: { xs: '0.85rem', md: '1rem' }
              }}
            >
              {type.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedCategories;
