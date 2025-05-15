import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Chip,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  originalPrice: number;
  salePrice: number;
  colors: string[];
  sold: number;
  label: string;
}


interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const soldPercentage = (product.sold / 25) * 100;

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      sx={{
        width: 220,
        position: 'relative',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': { boxShadow: 6 },
      }}
      onClick={handleClick}
    >
      <Chip
        label="-49%"
        color="error"
        size="small"
        sx={{ position: 'absolute', top: 8, left: 8 }}
      />
      <CardMedia
        component="img"
        height="260"
        image={product.imageUrl}
        alt={product.title}
      />
      <CardContent>
        <Chip
          label={product.label}
          color="warning"
          size="small"
          sx={{ mb: 1 }}
        />
        <Typography variant="body1" fontWeight="bold">
          {product.title.toUpperCase()}
        </Typography>
        <Typography variant="body2" color="error" fontWeight="bold">
          {product.salePrice.toLocaleString()}đ{' '}
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
          <Typography variant="caption">Đã bán {product.sold}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
