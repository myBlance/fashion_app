import { Box, Typography, Paper } from '@mui/material'; // import đúng

const categories = [
  { name: 'Áo', image: '/assets/icons/icon1.webp' },
  { name: 'Quần', image: '/assets/icons/icon2.webp' },
  { name: 'Váy', image: '/assets/icons/icon3.webp' },
  { name: 'Váy liền thân', image: '/assets/icons/icon4.webp' },
  { name: 'Quần jeans', image: '/assets/icons/icon5.webp' },
  { name: 'Áo len', image: '/assets/icons/icon6.webp' },
  { name: 'Áo nỉ', image: '/assets/icons/icon7.webp' },
];

const FeaturedCategories = () => {
  return (
    <Box sx={{ my: 5 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, textAlign:'center', }}>
        Danh mục nổi bật
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2, // Khoảng cách giữa các mục
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={index}
            sx={{
              flex: '1 1 calc(8% - 16px)', 
              Width: 120, 
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box
                component="img"
                src={category.image}
                alt={category.name}
                sx={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 1.5,
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {category.name}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedCategories;
