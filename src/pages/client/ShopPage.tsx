import React, { useState } from 'react';
import {
    Checkbox,
    ListItemText,
    Box,
    Typography,
    MenuItem,
    Select,
    SelectChangeEvent,
    FormControl,
    InputLabel,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
} from '@mui/material';
import ProductCard from '../../components/Client/ProductCard';
import { products } from '../../data/products';


const priceOptions = [
  { value: '1', label: 'Từ 200.000đ - 300.000đ' },
  { value: '2', label: 'Từ 300.000đ - 500.000đ' },
];

const typeOptions = [
  { value: 'ao', label: 'Áo' },
  { value: 'quan', label: 'Quần' },
];

const styleOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'nangdong', label: 'Năng động' },
];

const sizeOptions = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
];

const colorOptions = [
  { value: 'pink', label: 'Hồng' },
  { value: 'black', label: 'Đen' },
];

const deliveryOptions = [
  { value: 'free', label: 'Miễn phí giao hàng' },
  { value: 'fast', label: 'Giao nhanh' },
];

const getLabel = (key: string, value: string) => {
  let options: { value: string; label: string }[] = [];
  switch (key) {
    case 'price':
      options = priceOptions;
      break;
    case 'type':
      options = typeOptions;
      break;
    case 'style':
      options = styleOptions;
      break;
    case 'size':
      options = sizeOptions;
      break;
    case 'color':
      options = colorOptions;
      break;
    case 'delivery':
      options = deliveryOptions;
      break;
  }
  const option = options.find((opt) => opt.value === value);
  return option ? option.label : value;
};


const ShopPage: React.FC = () => {
  const [sort, setSort] = useState('name-asc');
  const [filters, setFilters] = useState<{
    price: string[];
    type: string[];
    style: string[];
    size: string[];
    color: string[];
    delivery: string[];
  }>({
    price: [],
    type: [],
    style: [],
    size: [],
    color: [],
    delivery: [],
  });

  const handleFilterChange = (key: string) => (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFilters((prev) => ({
      ...prev,
      [key]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  

  const handleSortChange = (
    event: React.MouseEvent<HTMLElement>,
    newSort: string | null
  ) => {
    if (newSort !== null) {
      setSort(newSort);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      price: [],
      type: [],
      style: [],
      size: [],
      color: [],
      delivery: [],
    });
  };

  const filteredProducts = products.filter((product) => {
    const { price, type, style, size, color, delivery } = filters;

    const matchPrice =
      price.length === 0 ||
      price.some((p) => {
        if (p === '1') return product.price >= 200000 && product.price <= 300000;
        if (p === '2') return product.price >= 300000 && product.price <= 500000;
        return true;
      });

    const matchType = type.length === 0 || type.includes(product.category.toLowerCase());

    const matchStyle = style.length === 0 || style.includes(product.label.toLowerCase());

    const matchSize = size.length === 0 || size.some((s) => product.sizes.includes(s));

    const matchColor = color.length === 0 || color.some((c) => product.colors.includes(c));

    const matchDelivery = delivery.length === 0 || delivery.includes(product.delivery);

    return matchPrice && matchType && matchStyle && matchSize && matchColor && matchDelivery;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;

      default:
        return 0;
    }
  });

  return (
    <Box p={3}>
      <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
        Tất cả sản phẩm
      </Typography>

      {/* Bộ lọc đang chọn */}
      <Box
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: '#eee',
          borderRadius: 2,
          border: '1px solid #ccc',
        }}
      >
        {Object.values(filters).some((arr) => arr.length > 0) && (
  <>
    <Typography fontWeight="bold" mb={1}>
      Bạn chọn
    </Typography>

    <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
      {Object.entries(filters).map(([key, values]) =>
        values.length > 0 &&
        values.map((val) => (
          <Chip
            key={'${key}-${val}'}
            label={getLabel(key, val)}
            onDelete={() =>
              setFilters((prev) => ({
                ...prev,
                [key]: prev[key as keyof typeof prev].filter((v) => v !== val),
              }))
            }
          />
        ))
      )}
    </Box>

    <Typography
      variant="body2"
      color="primary"
      sx={{ cursor: 'pointer', fontWeight: 'bold' }}
      onClick={clearAllFilters}
    >
      Bỏ hết ✕
    </Typography>
  </>
)}

        {/* Form bộ lọc */}
       <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
  <FormControl size="small" sx={{ minWidth: 160 }}>
    <InputLabel shrink={false}>Mức giá</InputLabel>
    <Select
      multiple
      value={filters.price}
      onChange={handleFilterChange('price')}
      displayEmpty
      renderValue={() => ''}
      inputProps={{ 'aria-label': 'Mức giá' }}
    >
      {priceOptions.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          <Checkbox checked={filters.price.indexOf(value) > -1} />
          <ListItemText primary={label} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl size="small" sx={{ minWidth: 160 }}>
    <InputLabel shrink={false}>Loại</InputLabel>
    <Select
      multiple
      value={filters.type}
      onChange={handleFilterChange('type')}
      displayEmpty
      renderValue={() => ''}
      inputProps={{ 'aria-label': 'Loại' }}
    >
      {typeOptions.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          <Checkbox checked={filters.type.indexOf(value) > -1} />
          <ListItemText primary={label} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl size="small" sx={{ minWidth: 160 }}>
    <InputLabel shrink={false}>Phong cách</InputLabel>
    <Select
      multiple
      value={filters.style}
      onChange={handleFilterChange('style')}
      displayEmpty
      renderValue={() => ''}
      inputProps={{ 'aria-label': 'Phong cách' }}
    >
      {styleOptions.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          <Checkbox checked={filters.style.indexOf(value) > -1} />
          <ListItemText primary={label} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl size="small" sx={{ minWidth: 160 }}>
    <InputLabel shrink={false}>Size</InputLabel>
    <Select
      multiple
      value={filters.size}
      onChange={handleFilterChange('size')}
      displayEmpty
      renderValue={() => ''}
      inputProps={{ 'aria-label': 'Size' }}
    >
      {sizeOptions.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          <Checkbox checked={filters.size.indexOf(value) > -1} />
          <ListItemText primary={label} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl size="small" sx={{ minWidth: 160 }}>
    <InputLabel shrink={false}>Màu sắc</InputLabel>
    <Select
      multiple
      value={filters.color}
      onChange={handleFilterChange('color')}
      displayEmpty
      renderValue={() => ''}
      inputProps={{ 'aria-label': 'Màu sắc' }}
    >
      {colorOptions.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          <Checkbox checked={filters.color.indexOf(value) > -1} />
          <ListItemText primary={label} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl size="small" sx={{ minWidth: 160 }}>
    <InputLabel shrink={false}>Dịch vụ giao hàng</InputLabel>
    <Select
      multiple
      value={filters.delivery}
      onChange={handleFilterChange('delivery')}
      displayEmpty
      renderValue={() => ''}
      inputProps={{ 'aria-label': 'Dịch vụ giao hàng' }}
    >
      {deliveryOptions.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          <Checkbox checked={filters.delivery.indexOf(value) > -1} />
          <ListItemText primary={label} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>

      </Box>

      {/* Bộ sắp xếp */}
      <Box mb={3}>
        <Typography variant="subtitle1" mb={1}>
          Sắp xếp theo:
        </Typography>
        <ToggleButtonGroup
          value={sort}
          exclusive
          onChange={handleSortChange}
          size="small"
        >
          <ToggleButton value="name-asc">Tên A-Z</ToggleButton>
          <ToggleButton value="name-desc">Tên Z-A</ToggleButton>
          <ToggleButton value="newest">Hàng mới</ToggleButton>
          <ToggleButton value="price-asc">Giá thấp đến cao</ToggleButton>
          <ToggleButton value="price-desc">Giá cao xuống thấp</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Danh sách sản phẩm */}
      <Box display="flex" flexWrap="wrap" justifyContent="flex-start" gap={3}>
        {sortedProducts.map((product) => (
          <Box key={product.id}>
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ShopPage;