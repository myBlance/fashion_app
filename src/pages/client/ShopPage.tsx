import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Button,
  Drawer,
  Pagination,
  SelectChangeEvent,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/Client/Productcard/ProductCard';
import ActiveFilters from '../../components/Client/Shop/ActiveFilters';
import FilterSelect from '../../components/Client/Shop/FilterSelect';
import SortControls from '../../components/Client/Shop/SortControls';
import {
  colorOptions,
  priceOptions,
  sizeOptions,
  styleOptions,
  typeOptions,
} from "../../constants/filterOptions";
import { getProducts } from '../../services/productService';
import { Product } from "../../types/Product";

interface Filters {
  price: string[];
  type: string[];
  style: string[];
  size: string[];
  color: string[];
}

const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [sort, setSort] = useState('name-asc');
  const [filters, setFilters] = useState<Filters>({
    price: [],
    type: [],
    style: [],
    size: [],
    color: [],
  });
  const [loading, setLoading] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ Read URL params and apply filters on mount
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setFilters(prev => ({
        ...prev,
        type: [typeParam],
      }));
    }
  }, [searchParams]);

  // Apply filters client-side
  useEffect(() => {
    if (!allProducts.length) return;

    let filtered = [...allProducts];

    // Filter by price
    if (filters.price.length > 0) {
      filtered = filtered.filter(product => {
        return filters.price.some(priceRange => {
          const price = product.price;
          switch (priceRange) {
            case '1': return price >= 50000 && price <= 100000;
            case '2': return price >= 100000 && price <= 200000;
            case '3': return price >= 200000 && price <= 300000;
            case '4': return price >= 300000 && price <= 500000;
            case '5': return price >= 500000 && price <= 1000000;
            case '6': return price > 1000000;
            default: return false;
          }
        });
      });
    }

    // Filter by type
    if (filters.type.length > 0) {
      filtered = filtered.filter(product =>
        filters.type.includes(product.type)
      );
    }

    // Filter by style
    if (filters.style.length > 0) {
      filtered = filtered.filter(product =>
        filters.style.includes(product.style)
      );
    }

    // Filter by size
    if (filters.size.length > 0) {
      filtered = filtered.filter(product =>
        filters.size.some(size => product.sizes?.includes(size))
      );
    }

    // Filter by color
    if (filters.color.length > 0) {
      filtered = filtered.filter(product =>
        filters.color.some(color => product.colors?.includes(color))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

    setFilteredProducts(filtered);
    setPage(1);
  }, [filters, sort, allProducts]);

  // Fetch all products once on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Fetch all products, assuming the API can handle a large limit or no limit for initial fetch
        const { data } = await getProducts(0, 1000); // Adjust limit as needed for your backend
        setAllProducts(Array.isArray(data) ? data : []);
        setFilteredProducts(Array.isArray(data) ? data : []); // Initialize filtered products with all products
      } catch (err) {
        console.error('Error fetching products:', err);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []); // Empty dependency array means this runs once on mount

  const handleFilterChange = (key: keyof Filters) => (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFilters((prev) => ({
      ...prev,
      [key]: typeof value === 'string' ? value.split(',') : value,
    }));
    setPage(1);
  };

  const handleSortChange = (_event: React.MouseEvent<HTMLElement>, newSort: string | null) => {
    if (newSort !== null) setSort(newSort);
  };

  const handleRemoveFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      price: [],
      type: [],
      style: [],
      size: [],
      color: [],
    });
    setPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
  };

  // Get paginated products
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit
  );

  const FilterContent = () => (
    <>
      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={clearAllFilters}
      />

      <Box display="flex" flexWrap="wrap" gap={2} mb={0}>
        <FilterSelect
          label="Mức giá"
          value={filters.price}
          onChange={handleFilterChange('price')}
          options={priceOptions}
          ariaLabel="Mức giá"
          count={filters.price.length}
        />
        <FilterSelect
          label="Loại"
          value={filters.type}
          onChange={handleFilterChange('type')}
          options={typeOptions}
          ariaLabel="Loại"
          count={filters.type.length}
        />
        <FilterSelect
          label="Phong cách"
          value={filters.style}
          onChange={handleFilterChange('style')}
          options={styleOptions}
          ariaLabel="Phong cách"
          count={filters.style.length}
        />
        <FilterSelect
          label="Size"
          value={filters.size}
          onChange={handleFilterChange('size')}
          options={sizeOptions}
          ariaLabel="Size"
          count={filters.size.length}
        />
        <FilterSelect
          label="Màu sắc"
          value={filters.color}
          onChange={handleFilterChange('color')}
          options={colorOptions}
          ariaLabel="Màu sắc"
          count={filters.color.length}
        />
      </Box>
    </>
  );

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
        Tất cả sản phẩm
      </Typography>

      {/* Mobile: Filter Button */}
      {isMobile && (
        <Box display="flex" justifyContent="center" mb={2}>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDrawerOpen(true)}
            color="error"
          >
            Bộ lọc {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Button>
        </Box>
      )}

      {/* Desktop: Filter Bar */}
      {!isMobile && (
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
          <FilterContent />
        </Box>
      )}

      {/* Mobile: Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            maxHeight: '80vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 3
          }
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Bộ lọc
        </Typography>
        <FilterContent />
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setFilterDrawerOpen(false)}
        >
          Áp dụng
        </Button>
      </Drawer>

      <SortControls sort={sort} onChange={handleSortChange} />

      {/* Product Grid with Skeleton Loading */}
      {loading ? (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)',
          }}
          gap={2}
          justifyItems="center"
        >
          {[...Array(12)].map((_, index) => (
            <Box key={index} minWidth="180px" width="100%">
              <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 2 }} />
              <Skeleton width="80%" sx={{ mt: 1 }} />
              <Skeleton width="60%" />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)',
          }}
          gap={2}
          justifyItems="center"
          justifyContent="start"
        >
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <Box key={product.id} minWidth="180px" sx={{ mb: 4 }}>
                <ProductCard product={product} />
              </Box>
            ))
          ) : (
            <Box textAlign="center" width="100%" py={8} gridColumn="1 / -1">
              <Typography variant="h6" color="text.secondary" mb={2}>
                Không tìm thấy sản phẩm nào
              </Typography>
              {getActiveFilterCount() > 0 && (
                <Button variant="outlined" onClick={clearAllFilters}>
                  Xóa bộ lọc
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* MUI Pagination */}
      {!loading && filteredProducts.length > limit && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(filteredProducts.length / limit)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default ShopPage;
