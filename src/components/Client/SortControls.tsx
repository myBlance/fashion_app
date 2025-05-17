// components/SortControls.tsx
import React from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { sortOptions } from '../../constants/filterOptions';

interface SortControlsProps {
  sort: string;
  onChange: (event: React.MouseEvent<HTMLElement>, newSort: string | null) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sort, onChange }) => {
  return (
    <Box mb={3}>
      <Typography variant="subtitle1" mb={1}>
        Sắp xếp theo:
      </Typography>
      <ToggleButtonGroup
        value={sort}
        exclusive
        onChange={onChange}
        size="small"
      >
        {sortOptions.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default SortControls;