import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { SearchInput, SelectInput, TextInput } from 'react-admin';
import { typeChoices } from '../../../constants/filterOptions';

export const productFilters = [
    <SearchInput 
        source='q' 
        alwaysOn 
        key='search'
        placeholder='Tìm kiếm sản phẩm...'
        variant='outlined' sx={{ml:2}}
        InputProps={{
             endAdornment: (
                <InputAdornment position='end'>
                    <SearchIcon color='action' />
                </InputAdornment>
        ),
        }}
    />,
    <TextInput source='name' label='Tên sản phẩm' key='name' variant='outlined' />,
    <SelectInput
        source='type'
        label='Danh mục'
        variant='outlined'
        choices={typeChoices}
        key='type'
    />,
    <SelectInput
        variant='outlined'
        source='status'
        label='Trạng thái'
        choices={[
            { id: 'true', name: 'Hoạt động' },
            { id: 'false', name: 'Ngừng bán' },
        ]}
        key='status'
    />,
    
];