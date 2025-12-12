import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { SelectInput, TextInput } from 'react-admin';

export const reviewFilters = [
    <TextInput
        source="q"
        label="Tìm kiếm"
        alwaysOn
        variant="outlined"
        key="search"
        sx={{ ml: 2, minWidth: 300 }}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <SearchIcon color="action" />
                </InputAdornment>
            ),
        }}
    />,
    <SelectInput
        source="rating"
        label="Số sao"
        variant="outlined"
        choices={[
            { id: 5, name: '5 Sao' },
            { id: 4, name: '4 Sao' },
            { id: 3, name: '3 Sao' },
            { id: 2, name: '2 Sao' },
            { id: 1, name: '1 Sao' },
        ]}
        alwaysOn
        key="rating"
        sx={{ minWidth: 200 }}
    />,
    <TextInput
        source="orderId"
        label="Mã đơn hàng"
        variant="outlined"
        key="orderId"
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <SearchIcon color="action" />
                </InputAdornment>
            ),
        }}
    />,
    <TextInput
        source="productId"
        label="ID Sản phẩm"
        variant="outlined"
        key="productId"
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <SearchIcon color="action" />
                </InputAdornment>
            ),
        }}
    />,
    <TextInput
        source="userId"
        label="ID Người dùng"
        variant="outlined"
        key="userId"
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <SearchIcon color="action" />
                </InputAdornment>
            ),
        }}
    />,
];
