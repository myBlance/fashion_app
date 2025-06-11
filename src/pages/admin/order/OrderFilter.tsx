import { SelectInput, TextInput } from "react-admin";
import { InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export const orderFilters = [
    <TextInput 
        source="q" 
        label="Tìm kiếm" 
        alwaysOn 
        variant="outlined"
        sx={{ml:2}}
        InputProps={{
             endAdornment: (
                <InputAdornment position="end">
                    <SearchIcon color="action" />
                </InputAdornment>
        ),}}
    />,
    <SelectInput
        variant="outlined"
        source="status"
        label="Trạng thái"
        choices={[
            { id: 'pending', name: 'Chờ xác nhận' },
            { id: 'shipping', name: 'Đang giao' },
            { id: 'completed', name: 'Đã hoàn thành' },
            { id: 'cancelled', name: 'Đã hủy' },
        ]}
    />
];
