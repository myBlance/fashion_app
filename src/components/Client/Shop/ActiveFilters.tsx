import { Box, Chip, Fade, Typography } from '@mui/material';
import React from 'react';
import { Filters, getLabel } from '../../../utils/filterUtils';

interface ActiveFiltersProps {
    filters: Filters;
    onRemoveFilter: <K extends keyof Filters>(key: K, value: string) => void;
    onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    filters,
    onRemoveFilter,
    onClearAll,
}) => {
    const hasFilters = Object.values(filters).some((arr) => arr.length > 0);

    if (!hasFilters) return null;

    return (
        <Fade in={hasFilters}>
            <Box mb={3} p={2} bgcolor="#fafafa" borderRadius={2} border="1px dashed #e0e0e0">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography fontWeight="bold" color='#333'>
                        Bộ lọc đang chọn
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: '#e82e2e',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                        onClick={onClearAll}
                    >
                        Xóa tất cả
                    </Typography>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={1}>
                    {(Object.keys(filters) as Array<keyof Filters>).map((key) =>
                        filters[key].length > 0 &&
                        filters[key].map((val) => (
                            <Chip
                                key={`${key}-${val}`}
                                label={getLabel(key, val)}
                                onDelete={() => onRemoveFilter(key, val)}
                                sx={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #ffcdd2',
                                    color: '#c62828',
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: '#ffebee',
                                        borderColor: '#ef9a9a',
                                    },
                                    '& .MuiChip-deleteIcon': {
                                        color: '#ef5350',
                                        '&:hover': {
                                            color: '#d32f2f',
                                        }
                                    }
                                }}
                            />
                        ))
                    )}
                </Box>
            </Box>
        </Fade>
    );
};

export default ActiveFilters;