import { Box, SelectChangeEvent } from '@mui/material';
import React from 'react';
import {
    colorOptions,
    priceOptions,
    sizeOptions,
    styleOptions,
    typeOptions,
} from "../../../constants/filterOptions";
import ActiveFilters from './ActiveFilters';
import FilterSelect from './FilterSelect';

export interface Filters {
    price: string[];
    type: string[];
    style: string[];
    size: string[];
    color: string[];
}

interface ShopFiltersProps {
    filters: Filters;
    onFilterChange: (key: keyof Filters) => (event: SelectChangeEvent<string[]>) => void;
    onRemoveFilter: (key: keyof Filters, value: string) => void;
    onClearAll: () => void;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
    filters,
    onFilterChange,
    onRemoveFilter,
    onClearAll
}) => {
    return (
        <>
            <ActiveFilters
                filters={filters}
                onRemoveFilter={onRemoveFilter}
                onClearAll={onClearAll}
            />

            <Box display="flex" flexWrap="wrap" gap={2} mb={0}>
                <FilterSelect
                    label="Mức giá"
                    value={filters.price}
                    onChange={onFilterChange('price')}
                    options={priceOptions}
                    ariaLabel="Mức giá"
                    count={filters.price.length}
                />
                <FilterSelect
                    label="Loại"
                    value={filters.type}
                    onChange={onFilterChange('type')}
                    options={typeOptions}
                    ariaLabel="Loại"
                    count={filters.type.length}
                />
                <FilterSelect
                    label="Phong cách"
                    value={filters.style}
                    onChange={onFilterChange('style')}
                    options={styleOptions}
                    ariaLabel="Phong cách"
                    count={filters.style.length}
                />
                <FilterSelect
                    label="Size"
                    value={filters.size}
                    onChange={onFilterChange('size')}
                    options={sizeOptions}
                    ariaLabel="Size"
                    count={filters.size.length}
                />
                <FilterSelect
                    label="Màu sắc"
                    value={filters.color}
                    onChange={onFilterChange('color')}
                    options={colorOptions}
                    ariaLabel="Màu sắc"
                    count={filters.color.length}
                />
            </Box>
        </>
    );
};

export default ShopFilters;
