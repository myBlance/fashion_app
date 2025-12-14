import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { SearchInput, SelectInput, TextInput } from 'react-admin';

export const userFilters = [
    <SearchInput
        source="q"
        alwaysOn
        key="search"
        placeholder="Tìm kiếm người dùng..."
        variant="outlined"
        sx={{ ml: 2 }}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <SearchIcon color="action" />
                </InputAdornment>
            ),
        }}
    />,
    <TextInput source="username" label="Tên đăng nhập" key="username" variant="outlined" />,
    <TextInput source="email" label="Email" key="email" variant="outlined" />,
    <TextInput source="phone" label="Số điện thoại" key="phone" variant="outlined" />,
    <SelectInput
        source="role"
        label="Vai trò"
        variant="outlined"
        choices={[
            { id: 'admin', name: 'Quản trị viên' },
            { id: 'user', name: 'Người dùng' },
        ]}
        key="role"
    />,
    <SelectInput
        source="status"
        label="Trạng thái"
        variant="outlined"
        choices={[
            { id: 'active', name: 'Hoạt động' },
            { id: 'banned', name: 'Bị cấm' },
            { id: 'inactive', name: 'Không hoạt động' },
        ]}
        key="status"
    />,
];
