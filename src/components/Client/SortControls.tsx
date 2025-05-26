import React from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { sortOptions } from '../../constants/filterOptions';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

interface SortControlsProps {
  sort: string;
  onChange: (event: React.MouseEvent<HTMLElement>, newSort: string | null) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sort, onChange }) => {
    return (
        <Box mb={3} display="flex" flexDirection="column" alignItems="center">
            {/* Icon + Text trên cùng 1 dòng */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <SortByAlphaIcon sx={{ color: '#000000' }} />
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#000000"
                >
                    Xếp theo
                </Typography>
            </Box>
            <ToggleButtonGroup
                value={sort}
                exclusive
                onChange={onChange}
                size="small"
                
            >
                {sortOptions.map((option) => (
                    <ToggleButton 
                        key={option.value} 
                        value={option.value} 
                        sx={{
                           
                            color: '#000',
                            '&.Mui-selected': {
                            backgroundColor: '#fd5f5f',
                            border:'1px solid #fd5f5f',
                            color: '#fff', 
                            },
                            '&.Mui-selected:hover': {
                            backgroundColor: '#e83d3d', 
                            },
                        }}
                    >
                        {option.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
};


export default SortControls;