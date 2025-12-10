import {
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import React from 'react';

interface FilterSelectProps {
    label: string;
    value: string[];
    onChange: (event: SelectChangeEvent<string[]>) => void;
    options: { value: string; label: string }[];
    ariaLabel: string;
    count?: number;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
    label,
    value,
    onChange,
    options,
    ariaLabel,
    count = 0,
}) => {
    return (
        <FormControl size="small" sx={{ minWidth: 200, m: 0.5 }}>
            <InputLabel shrink={false} sx={{
                color: '#333',
                fontWeight: 600,
                '&.Mui-focused': { color: '#e82e2e' }
            }}>
                {label} {count > 0 && `(${count})`}
            </InputLabel>
            <Select
                multiple
                value={value}
                onChange={onChange}
                displayEmpty
                renderValue={() => ''}
                inputProps={{ 'aria-label': ariaLabel }}
                sx={{
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '&:hover': {
                        backgroundColor: '#fafafa',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#bdbdbd',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e82e2e',
                    },
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            mt: 1,
                            maxHeight: 300,
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }
                    }
                }}
            >
                {options.map(({ value: optionValue, label: optionLabel }) => (
                    <MenuItem
                        key={optionValue}
                        value={optionValue}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(232, 46, 46, 0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(232, 46, 46, 0.12)',
                                }
                            },
                        }}
                    >
                        <Checkbox
                            checked={value.indexOf(optionValue) > -1}
                            sx={{
                                color: '#bdbdbd',
                                '&.Mui-checked': {
                                    color: '#e82e2e',
                                }
                            }}
                        />
                        <ListItemText primary={optionLabel} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default FilterSelect;