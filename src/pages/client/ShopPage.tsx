import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import ProductCard from '../../components/Client/ProductCard';
import { Product, getProducts } from '../../services/productService';
import {
  priceOptions,
  typeOptions,
  styleOptions,
  sizeOptions,
  colorOptions,
  deliveryOptions,
} from "../../constants/filterOptions";
import FilterSelect from '../../components/Client/FilterSelect';
import ActiveFilters from '../../components/Client/ActiveFilters';
import SortControls from '../../components/Client/SortControls';

interface Filters {
  price: string[];
  type: string[];
  style: string[];
  size: string[];
  color: string[];
  delivery: string[];
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 12; // số sản phẩm mỗi trang
  const [sort, setSort] = useState('name-asc');
  const [filters, setFilters] = useState<Filters>({
    price: [],
    type: [],
    style: [],
    size: [],
    color: [],
    delivery: [],
  });
  const [loading, setLoading] = useState(false);

  // Chuyển sort frontend sang param backend
  const mapSortToAPI = (sortStr: string) => {
    switch (sortStr) {
      case 'price-asc': return { _sort: 'price', _order: 'ASC' };
      case 'price-desc': return { _sort: 'price', _order: 'DESC' };
      case 'name-asc': return { _sort: 'name', _order: 'ASC' };
      case 'name-desc': return { _sort: 'name', _order: 'DESC' };
      default: return { _sort: 'createdAt', _order: 'DESC' };
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { _sort, _order } = mapSortToAPI(sort);

      // build filter params cho API
      const filterParams: Record<string, string> = {};
      Object.entries(filters).forEach(([key, arr]) => {
        if (arr.length > 0) filterParams[key] = arr.join(',');
      });

      const { data, total } = await getProducts(
        page * limit,
        (page + 1) * limit,
        _sort,
        _order as 'ASC' | 'DESC',
        filterParams
      );
      // ✅ kiểm tra an toàn
      setProducts(Array.isArray(data) ? data : []);
      setTotal(total || 0);
    } catch (err) {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sort, filters]);

  const handleFilterChange = (key: keyof Filters) => (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFilters((prev) => ({
      ...prev,
      [key]: typeof value === 'string' ? value.split(',') : value,
    }));
    setPage(0);
  };

  const handleSortChange = (_event: React.MouseEvent<HTMLElement>, newSort: string | null) => {
    if (newSort !== null) setSort(newSort);
  };

  const handleRemoveFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
    setPage(0);
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
    setPage(0);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
        Tất cả sản phẩm
      </Typography>

      {/* Bộ lọc */}
      <Box
        sx={{
          p: 4,
          maxWidth: '90%',
          margin: '0 5%',
          mb: 2,
          backgroundColor: '#eee',
          borderRadius: 2,
          border: '1px solid #e82e2e',
        }}
      >
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={clearAllFilters}
        />

        <Box display="flex" flexWrap="wrap" gap={2} mb={0}>
          <FilterSelect label="Mức giá" value={filters.price} onChange={handleFilterChange('price')} options={priceOptions} ariaLabel="Mức giá" />
          <FilterSelect label="Loại" value={filters.type} onChange={handleFilterChange('type')} options={typeOptions} ariaLabel="Loại" />
          <FilterSelect label="Phong cách" value={filters.style} onChange={handleFilterChange('style')} options={styleOptions} ariaLabel="Phong cách" />
          <FilterSelect label="Size" value={filters.size} onChange={handleFilterChange('size')} options={sizeOptions} ariaLabel="Size" />
          <FilterSelect label="Màu sắc" value={filters.color} onChange={handleFilterChange('color')} options={colorOptions} ariaLabel="Màu sắc" />
          <FilterSelect label="Dịch vụ giao hàng" value={filters.delivery} onChange={handleFilterChange('delivery')} options={deliveryOptions} ariaLabel="Dịch vụ giao hàng" />
        </Box>
      </Box>

      <SortControls sort={sort} onChange={handleSortChange} />

      {/* Danh sách sản phẩm */}
      {loading ? (
        <Typography textAlign="center">Đang tải sản phẩm...</Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)',
          }}
          gap={2}
          justifyItems="center"
          justifyContent="start"
        >
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <Box key={product.id} minWidth="180px" sx={{ mb: 4 }}>
                <ProductCard product={product} />
              </Box>
            ))
          ) : (
            <Typography textAlign="center" width="100%">Không có sản phẩm nào</Typography>
          )}
        </Box>
      )}

      {/* Phân trang */}
      {total > limit && (
        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Trang {page + 1} / {Math.ceil(total / limit)}</span>
          <button disabled={(page + 1) * limit >= total} onClick={() => setPage(page + 1)}>Next</button>
        </Box>
      )}
    </Box>
  );
};

export default ShopPage;
