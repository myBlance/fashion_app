import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React from 'react';
import { sortOptions } from '../../../constants/filterOptions';

interface SortControlsProps {
    sort: string;
    onChange: (event: React.MouseEvent<HTMLElement>, newSort: string | null) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sort, onChange }) => {
    return (
        <Box mb={3} display="flex" flexDirection="column" alignItems="center">
            {/* Icon + Text trên cùng 1 dòng */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <SortByAlphaIcon sx={{ color: '#000000', fontSize: { xs: 18, sm: 24 } }} />
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#000000"
                    sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                >
                    Xếp theo
                </Typography>
            </Box>
            <ToggleButtonGroup
                value={sort}
                exclusive
                onChange={onChange}
                size="small"
                sx={{
                    flexWrap: 'wrap',
                    gap: { xs: '4px', sm: '0' },
                    justifyContent: 'center',
                }}
            >
                {sortOptions.map((option) => (
                    <ToggleButton
                        key={option.value}
                        value={option.value}
                        sx={{
                            color: '#000',
                            fontSize: { xs: '11px', sm: '13px' },
                            padding: { xs: '4px 8px', sm: '6px 12px' },
                            '&.Mui-selected': {
                                backgroundColor: '#fd5f5f',
                                border: '1px solid #fd5f5f',
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