import { useState } from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    SelectInput,
    CheckboxGroupInput,
    ImageInput,
    ImageField,
    required,
    useRecordContext,
} from 'react-admin';

import { Box, Card, Divider, Typography, Button, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
    width: 150,
    marginRight: 5,
    marginBottom: 2,
};

// ✅ Component hiển thị và cho phép xóa ảnh thumbnail
const ThumbnailInput = () => {
    const record = useRecordContext();
    const [thumbnail, setThumbnail] = useState(record?.thumbnail || null);

    const handleDelete = () => {
        setThumbnail(null);
    };

    return (
        <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
                Ảnh đại diện
            </Typography>

            {thumbnail ? (
                <Stack direction="column" spacing={1}>
                    <Box
                        component="img"
                        src={
                            thumbnail.startsWith('http')
                                ? thumbnail
                                : `${API_BASE_URL}/uploads/${thumbnail}`
                        }
                        alt="Thumbnail"
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: 2,
                            objectFit: 'cover',
                            border: '1px solid #ddd',
                        }}
                    />
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                        sx={{ width: 120 }}
                    >
                        Xóa ảnh
                    </Button>
                </Stack>
            ) : (
                <ImageInput
                    source="thumbnail"
                    label="Tải ảnh mới"
                    accept={{ 'image/*': [] }}
                    multiple={false}
                >
                    <ImageField source="src" title="Ảnh mới" />
                </ImageInput>
            )}
        </Box>
    );
};

// ✅ Component hiển thị và cho phép xóa nhiều ảnh phụ
const MultipleImagesInput = () => {
    const record = useRecordContext();
    const [images, setImages] = useState(record?.images || []);

    const handleDelete = (index: number) => {
        setImages(images.filter((_: any, i: number) => i !== index));
    };

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                Ảnh phụ
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap">
                {images.map((img: string, index: number) => (
                    <Box key={index} position="relative">
                        <Box
                            component="img"
                            src={
                                img.startsWith('http')
                                    ? img
                                    : `${API_BASE_URL}/uploads/${img}`
                            }
                            alt={`Ảnh ${index + 1}`}
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: 2,
                                objectFit: 'cover',
                                border: '1px solid #ddd',
                            }}
                        />
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(index)}
                            sx={{
                                position: 'absolute',
                                top: -10,
                                right: -10,
                                minWidth: 0,
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                padding: 0,
                            }}
                        />
                    </Box>
                ))}
            </Stack>

            <Box mt={2}>
                <ImageInput
                    source="images"
                    label="Thêm ảnh mới"
                    accept={{ 'image/*': [] }}
                    multiple
                >
                    <ImageField source="src" title="Ảnh mới" />
                </ImageInput>
            </Box>
        </Box>
    );
};

export const ProductEdit = () => {
    return (
        <Card
            sx={{
                borderRadius: '20px',
                mr: '-24px',
                height: '100%',
                boxShadow: 'none',
                overflow: 'visible',
            }}
        >
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs />
            </Box>

            <Edit
                title="🛍️ Chỉnh sửa sản phẩm"
                mutationMode="pessimistic"
                sx={{
                    border: '2px solid #ddd',
                    borderRadius: '20px',
                    mx: '20px',
                    mb: '20px',
                }}
            >
                <SimpleForm>
                    {/* --- Thông tin cơ bản --- */}
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

                    {/* --- Thuộc tính sản phẩm --- */}
                    <Box mb={2}>
                        <Typography variant="h6">Thuộc tính sản phẩm</Typography>
                        <Divider />
                    </Box>

                    <Box display="flex" gap={4} mb={4}>
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

                    {/* --- Giá & Tồn kho --- */}
                    <Box mb={2}>
                        <Typography variant="h6">Giá & Tồn kho</Typography>
                        <Divider />
                    </Box>

                    <Box display="flex" flexWrap="wrap" mb={4}>
                        <Box sx={fieldStyle}>
                            <NumberInput source="price" label="Giá bán" fullWidth variant="outlined" />
                        </Box>
                        <Box sx={fieldStyle}>
                            <NumberInput source="originalPrice" label="Giá gốc" fullWidth variant="outlined" />
                        </Box>
                        <Box sx={fieldStyle}>
                            <NumberInput source="sold" label="Đã bán" fullWidth variant="outlined" />
                        </Box>
                        <Box sx={{ ...fieldStyle, marginRight: 0 }}>
                            <NumberInput source="total" label="Tổng số lượng" fullWidth variant="outlined" />
                        </Box>
                    </Box>

                    {/* --- Trạng thái --- */}
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

                    {/* --- Ảnh sản phẩm --- */}
                    <Divider sx={{ my: 2 }} />
                    <Box mb={4}>
                        <Typography variant="h6">Ảnh sản phẩm</Typography>
                        <ThumbnailInput />
                        <MultipleImagesInput />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                        * Ngày tạo và các trường tự động sẽ không chỉnh sửa được.
                    </Typography>
                </SimpleForm>
            </Edit>
        </Card>
    );
};
