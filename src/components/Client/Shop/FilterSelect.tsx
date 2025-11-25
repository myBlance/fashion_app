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
        <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel shrink={false}>
                {label} {count > 0 && `(${count})`}
            </InputLabel>
            <Select
                multiple
                value={value}
                onChange={onChange}
                displayEmpty
                renderValue={() => ''}
                inputProps={{ 'aria-label': ariaLabel }}
            >
                {options.map(({ value: optionValue, label: optionLabel }) => (
                    <MenuItem key={optionValue} value={optionValue}>
                        <Checkbox checked={value.indexOf(optionValue) > -1} />
                        <ListItemText primary={optionLabel} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default FilterSelect;