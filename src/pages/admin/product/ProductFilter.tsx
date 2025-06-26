import { InputAdornment } from '@mui/material';
import { TextInput, SelectInput, SearchInput } from 'react-admin';
import  SearchIcon  from '@mui/icons-material/Search';

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
    <TextInput source='brand' label='Thương hiệu' key='brand' variant='outlined' />,
    <SelectInput
        source='category'
        label='Danh mục'
        variant='outlined'
        choices={[
            { id: 'Quần', name: 'Quần' },
            { id: 'Áo', name: 'Áo' },
            { id: 'Váy', name: 'Váy' },
        ]}
        key='category'
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