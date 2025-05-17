// components/ActiveFilters.tsx
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { getLabel, Filters } from '../../utils/filterUtils';

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
    <>
      <Typography fontWeight="bold" mb={1}>
        Bạn chọn
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
        {(Object.keys(filters) as Array<keyof Filters>).map((key) =>
          filters[key].length > 0 &&
          filters[key].map((val) => (
            <Chip
              key={`${key}-${val}`}
              label={getLabel(key, val)}
              onDelete={() => onRemoveFilter(key, val)}
            />
          ))
        )}
      </Box>

      <Typography
        variant="body2"
        color="primary"
        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
        onClick={onClearAll}
      >
        Bỏ hết ✕
      </Typography>
    </>
  );
};

export default ActiveFilters;