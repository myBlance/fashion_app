import {
    CheckboxGroupInput,
    Edit,
    ImageField,
    ImageInput,
    NumberInput,
    SelectInput,
    SimpleForm,
    TextInput,
    required,
} from 'react-admin';

import { Box, Card, Divider, Typography } from '@mui/material';
import type { Accept } from 'react-dropzone';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';

const categoryChoices = [
    { id: 'ao', name: 'Áo' },
    { id: 'quan', name: 'Quần' },
    { id: 'giay', name: 'Giày' },
];

const colorChoices = [
    { id: 'red', name: 'Đỏ' },
    { id: 'blue', name: 'Xanh dương' },
    { id: 'green', name: 'Xanh lá' },
    { id: 'black', name: 'Đen' },
    { id: 'white', name: 'Trắng' },
    { id: '#ff69b4', name: 'Hồng' },
];

const fieldStyle = { 
    flex: '1 1 150px', 
    Width: 150, 
    marginRight: 5, 
    marginBottom: 2 
};

export const ProductEdit = () => {
    return (
        <Card sx={{ 
            borderRadius: "20px", 
            mr: "-24px", 
            height: "100%",
            boxShadow: 'none',
            overflow: 'visible'
        }}>
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs  />
            </Box>
            <Edit title="🛍️ Chỉnh sửa sản phẩm" 
                sx={{
                    border: "2px solid #ddd",
                    borderRadius: "20px",
                    mx: "20px",
                    mb: "20px",
                    '& .RaList-actions':{
                        mb: '20px',
                    },
                    '& .RaList-content': {
                        boxShadow: 'none',
                    },
                }}
            >
                <SimpleForm>
                    <Box mb={2}>
                        <Typography variant="h6">Thông tin cơ bản</Typography>
                        <Divider />
                    </Box>

                    <Box display="flex" flexWrap="wrap" mb={4}>
                        <Box sx={fieldStyle}>
                            <TextInput
                                source="id"
                                label="Mã sản phẩm"
                                disabled
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={fieldStyle}>
                            <TextInput
                                source="name"
                                label="Tên sản phẩm"
                                validate={required()}
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={fieldStyle}>
                            <TextInput
                                source="brand"
                                label="Thương hiệu"
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ ...fieldStyle, marginRight: 0 }}>
                            <SelectInput
                                source="category"
                                label="Danh mục"
                                choices={categoryChoices}
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="h6">Thuộc tính sản phẩm</Typography>
                        <Divider />
                    </Box>

                    <Box display="flex" gap={4} mb={4}>
                        {/* Cột màu sắc */}
                        <Box>
                            <CheckboxGroupInput
                                source="colors"
                                label="Màu sắc"
                                choices={colorChoices}
                                optionValue="id"
                                optionText={(choice) => (
                                    <Box display="flex" alignItems="center">
                                        <Box
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                backgroundColor: choice.id,
                                                border: '1px solid #ccc',
                                                marginRight: 1,
                                            }}
                                        />
                                        {choice.name}
                                    </Box>
                                )}
                                sx={{
                                    '& .MuiFormGroup-root': {
                                        flexDirection: 'column',
                                    },
                                }}
                            />
                        </Box>

                        {/* Cột kích cỡ */}
                        <Box>
                            <CheckboxGroupInput
                                source="sizes"
                                label="Kích cỡ"
                                choices={[
                                    { id: 'S', name: 'S' },
                                    { id: 'M', name: 'M' },
                                    { id: 'L', name: 'L' },
                                    { id: 'XL', name: 'XL' },
                                    { id: 'XXL', name: 'XXL' },
                                ]}
                                sx={{
                                    '& .MuiFormGroup-root': {
                                        flexDirection: 'column',
                                    },
                                }}
                            />
                        </Box>
                    </Box>


                    <Box mb={2}>
                        <Typography variant="h6">Giá & Tồn kho</Typography>
                        <Divider />
                    </Box>

                    <Box display="flex" flexWrap="wrap" mb={4}>
                        <Box sx={fieldStyle}>
                            <NumberInput
                                source="price"
                                label="Giá bán"
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={fieldStyle}>
                            <NumberInput
                                source="originalPrice"
                                label="Giá gốc"
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={fieldStyle}>
                            <NumberInput
                                source="sold"
                                label="Đã bán"
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ ...fieldStyle, marginRight: 0 }}>
                            <NumberInput
                                source="total"
                                label="Tổng số lượng"
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="h6">Trạng thái</Typography>
                        <Divider />
                    </Box>

                    <Box mb={3} sx={{ width: '200px' }}>
                        <SelectInput
                            source="status"
                            label="Trạng thái"
                            variant="outlined"
                            choices={[
                                { id: 'selling', name: 'Đang bán' },
                                { id: 'stopped', name: 'Ngừng bán' },
                                { id: 'sold_out', name: 'Hết hàng' },
                            ]}
                            fullWidth
                        />
                    </Box>

                    <Box mb={2}>
                        <Typography variant="h6">Ảnh đại diện</Typography>
                        <Divider />
                    </Box>

                    <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                        <ImageInput
                            source="thumbnail"
                            label="Chọn ảnh"
                            accept={{ 'image/*': [] } as Accept}
                            fullWidth
                            multiple
                        >
                            <ImageField source="src" title="title" />
                        </ImageInput>
                    </Box>


                    <Typography variant="caption" color="text.secondary">
                        * Ngày tạo và các trường tự động sẽ không chỉnh sửa được.
                    </Typography>
                </SimpleForm>
            </Edit>
        </Card>
        
    );
};
