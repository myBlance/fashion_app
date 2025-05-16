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
          gap: 2,
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
                    '&.MuiPaper-root': {
                        boxShadow: 'none', // loại bỏ shadow
                    },
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        color: '#52b2b5'
                    },
                }}
            >
                <Box
                    component="img"
                    src={category.image}
                    alt={category.name}
                    sx={{
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: '0.3s',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                        border: '2px solid #ccc',
                        borderRadius: 50,
                        width: 150,
                        height: 150,
                        objectFit: 'cover',
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
