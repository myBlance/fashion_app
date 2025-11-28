import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { SelectInput, TextInput } from 'react-admin';

export const orderFilters = [
    <TextInput
        source='q'
        label='Tìm kiếm'
        alwaysOn
        variant='outlined'
        sx={{ ml: 2 }}
        InputProps={{
            endAdornment: (
                <InputAdornment position='end'>
                    <SearchIcon color='action' />
                </InputAdornment>
            ),
        }}
    />,
    <SelectInput
        variant='outlined'
        source='status'
        label='Trạng thái'
        choices={[
            { id: 'pending', name: 'Chờ xác nhận' },
            { id: 'confirmed', name: 'Đã xác nhận' },
            { id: 'awaiting_payment', name: 'Chờ thanh toán' },
            { id: 'paid', name: 'Đã thanh toán' },
            { id: 'processing', name: 'Đang xử lý' },
            { id: 'shipped', name: 'Đang giao' },
            { id: 'delivered', name: 'Đã giao' },
            { id: 'cancelled', name: 'Đã hủy' },
        ]}
    />
];
