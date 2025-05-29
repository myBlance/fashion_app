import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import ProductCard from '../../components/Client/ProductCard';
import { products, Product } from '../../data/products';
import { 
    priceOptions,
    typeOptions,
    styleOptions,
    sizeOptions,
    colorOptions,
    deliveryOptions,
} from "../../constants/filterOptions";
import {
    filterProducts,
    sortProducts,
    Filters,
} from '../../utils/filterUtils';
import FilterSelect from '../../components/Client/FilterSelect';
import ActiveFilters from '../../components/Client/ActiveFilters';
import SortControls from '../../components/Client/SortControls';

const ShopPage: React.FC = () => {
    const [sort, setSort] = useState('name-asc');
    const [filters, setFilters] = useState<Filters>({
        price: [],
        type: [],
        style: [],
        size: [],
        color: [],
        delivery: [],
    });

    const handleFilterChange = (key: keyof Filters) => (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        setFilters((prev) => ({
            ...prev,
            [key]: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleSortChange = (
        _event: React.MouseEvent<HTMLElement>,
        newSort: string | null
    ) => {
        if (newSort !== null) {
            setSort(newSort);
        }
    };

  const handleRemoveFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
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

    const filteredProducts = filterProducts(products, filters);
    const sortedProducts = sortProducts(filteredProducts, sort);

    return (
        <Box p={3}>
            <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
                Tất cả sản phẩm
            </Typography>

        {/* Filter section */}
            <Box
                sx={{
                    p: 4,
                    maxWidth: '90%',
                    margin:'0 5%',
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

                {/* Filter controls */}
                <Box display="flex" flexWrap="wrap" gap={2} mb={0}>
                    <FilterSelect
                        label="Mức giá"
                        value={filters.price}
                        onChange={handleFilterChange('price')}
                        options={priceOptions}
                        ariaLabel="Mức giá"
                    />
                    <FilterSelect
                        label="Loại"
                        value={filters.type}
                        onChange={handleFilterChange('type')}
                        options={typeOptions}
                        ariaLabel="Loại"
                    />
                    <FilterSelect
                        label="Phong cách"
                        value={filters.style}
                        onChange={handleFilterChange('style')}
                        options={styleOptions}
                        ariaLabel="Phong cách"
                    />
                    <FilterSelect
                        label="Size"
                        value={filters.size}
                        onChange={handleFilterChange('size')}
                        options={sizeOptions}
                        ariaLabel="Size"
                    />
                    <FilterSelect
                        label="Màu sắc"
                        value={filters.color}
                        onChange={handleFilterChange('color')}
                        options={colorOptions}
                        ariaLabel="Màu sắc"
                    />
                    <FilterSelect
                        label="Dịch vụ giao hàng"
                        value={filters.delivery}
                        onChange={handleFilterChange('delivery')}
                        options={deliveryOptions}
                        ariaLabel="Dịch vụ giao hàng"
                    />
                </Box>
            </Box>

            <SortControls sort={sort} onChange={handleSortChange} />

            {/* Product list */}
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
                justifyItems='center'
                justifyContent="start" // căn trái nếu không đủ
            >
                {sortedProducts.map((product: Product) => (
                    <Box 
                        key={product.id} 
                        minWidth="180px"
                        sx={{
                            mb: 4
                        }}
                    >
                        <ProductCard product={product} />
                    </Box>
                ))}
                </Box>
        </Box>
    );
};

export default ShopPage;