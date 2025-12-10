import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { Box, Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React from 'react';
import { sortOptions } from '../../../constants/filterOptions';

interface SortControlsProps {
    sort: string;
    onChange: (event: React.MouseEvent<HTMLElement>, newSort: string | null) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sort, onChange }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'transparent',
            }}
        >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box
                    sx={{
                        p: 0.5,
                        borderRadius: '50%',
                        backgroundColor: '#ffebee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <SortByAlphaIcon sx={{ color: '#d32f2f', fontSize: { xs: 20, sm: 24 } }} />
                </Box>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#333"
                    sx={{ fontSize: { xs: '15px', sm: '18px' } }}
                >
                    Sắp xếp theo
                </Typography>
            </Box>

            <ToggleButtonGroup
                value={sort}
                exclusive
                onChange={onChange}
                size="small"
                sx={{
                    flexWrap: 'wrap',
                    gap: 1,
                    justifyContent: 'center',
                    '& .MuiToggleButtonGroup-grouped': {
                        border: 0,
                        '&.Mui-disabled': {
                            border: 0,
                        },
                        '&:not(:first-of-type)': {
                            borderRadius: '20px',
                        },
                        '&:first-of-type': {
                            borderRadius: '20px',
                        },
                    },
                }}
            >
                {sortOptions.map((option) => (
                    <ToggleButton
                        key={option.value}
                        value={option.value}
                        sx={{
                            color: '#555',
                            fontSize: { xs: '12px', sm: '14px' },
                            padding: { xs: '6px 16px', sm: '8px 20px' },
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: '20px',
                            border: '1px solid #e0e0e0',
                            backgroundColor: '#fff',
                            transition: 'all 0.2s',
                            '&:hover': {
                                backgroundColor: '#fafafa',
                                borderColor: '#d32f2f',
                                color: '#d32f2f',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#d32f2f',
                                color: '#fff',
                                borderColor: '#d32f2f',
                                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.25)',
                                '&:hover': {
                                    backgroundColor: '#b71c1c',
                                },
                            },
                        }}
                    >
                        {option.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Paper>
    );
};


export default SortControls;