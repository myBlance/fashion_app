import { useState } from 'react';
import {
    CheckboxGroupInput,
    Edit,
    ImageField,
    ImageInput,
    NumberInput,
    required,
    SelectInput,
    SimpleForm,
    TextInput,
    useRecordContext,
} from 'react-admin';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { colorChoices, sizeChoices, styleChoices, typeChoices } from '../../../constants/filterOptions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';



// ✅ Component hiển thị và cho phép xáy ảnh thumbnail
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
        <Card sx={{ borderRadius: '20px', mr: '-24px', height: '100%', boxShadow: 'none', overflow: 'visible' }}>
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs />
            </Box>

            <Edit title="🛍️ Chỉnh sửa sản phẩm" mutationMode="pessimistic" sx={{ '& .RaEdit-main': { bgcolor: 'transparent', boxShadow: 'none' } }}>
                <SimpleForm sx={{ maxWidth: '1200px', margin: '0 auto', pb: 5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>

                        {/* === THÔNG TIN CƠ BẢN & MÔ TẢ === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'visible', bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6">Thông tin cơ bản</Typography>
                                    <Divider />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 1, minWidth: '150px' }}>
                                        <TextInput source="id" label="Mã sản phẩm" disabled fullWidth variant="outlined" />
                                    </Box>
                                    <Box sx={{ flex: 2, minWidth: '300px' }}>
                                        <TextInput source="name" label="Tên sản phẩm" validate={required()} fullWidth variant="outlined" placeholder="Nhập tên sản phẩm..." />
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                                        <TextInput source="brand" label="Thương hiệu" fullWidth variant="outlined" placeholder="Thương hiệu..." />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mt: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <SelectInput source="type" label="Danh mục" choices={typeChoices} fullWidth variant="outlined" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <SelectInput source="style" label="Phong cách" choices={styleChoices} fullWidth variant="outlined" />
                                    </Box>
                                </Box>

                                <Box mt={3} mb={2}>
                                    <Typography variant="h6">Mô tả sản phẩm</Typography>
                                    <Divider />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextInput source="description" label="Mô tả ngắn" multiline minRows={2} fullWidth variant="outlined" />
                                    <TextInput source="details" label="Chi tiết sản phẩm" multiline minRows={4} fullWidth variant="outlined" />
                                </Box>
                            </Box>
                        </Card>

                        {/* === GIÁ & TỒN KHO === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6">Giá & Tồn kho</Typography>
                                    <Divider />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <NumberInput source="price" label="Giá bán" fullWidth variant="outlined" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <NumberInput source="originalPrice" label="Giá gốc" fullWidth variant="outlined" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <NumberInput source="sold" label="Đã bán" fullWidth variant="outlined" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <NumberInput source="total" label="Tổng số lượng" fullWidth variant="outlined" />
                                    </Box>
                                </Box>

                                <Box mt={3} mb={2}>
                                    <Typography variant="h6">Trạng thái</Typography>
                                    <Divider />
                                </Box>
                                <Box sx={{ width: '250px' }}>
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
                            </Box>
                        </Card>

                        {/* === THUỘC TÍNH SẢN PHẨM === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6">Thuộc tính sản phẩm</Typography>
                                    <Divider />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 5 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: '#555' }}>MÀU SẮC</Typography>
                                        <CheckboxGroupInput
                                            source="colors"
                                            choices={colorChoices}
                                            optionValue="id"
                                            optionText={(choice) => (
                                                <Box display="flex" alignItems="center">
                                                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: choice.id, border: '1px solid #ddd', mr: 1 }} />
                                                    {choice.name}
                                                </Box>
                                            )}
                                            sx={{
                                                '& .MuiFormGroup-root': {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                                    gap: 1.5
                                                },
                                                '& .MuiFormControlLabel-root': {
                                                    mr: 0,
                                                    border: '1px solid #eee',
                                                    borderRadius: 1,
                                                    p: 1,
                                                    '&:hover': { bgcolor: '#f5f5f5' }
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: '#555' }}>KÍCH CỠ</Typography>
                                        <CheckboxGroupInput
                                            source="sizes"
                                            choices={sizeChoices}
                                            sx={{
                                                '& .MuiFormGroup-root': {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                                    gap: 1.5
                                                },
                                                '& .MuiFormControlLabel-root': {
                                                    mr: 0,
                                                    border: '1px solid #eee',
                                                    borderRadius: 1,
                                                    p: 1,
                                                    '&:hover': { bgcolor: '#f5f5f5' }
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Card>

                        {/* === ẢNH SẢN PHẨM === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6">Ảnh sản phẩm</Typography>
                                    <Divider />
                                </Box>
                                <ThumbnailInput />
                                <MultipleImagesInput />
                            </Box>
                        </Card>

                        <Typography variant="caption" color="text.secondary">
                            * Ngày tạo và các trường tự động sẽ không chỉnh sửa được.
                        </Typography>
                    </Box>
                </SimpleForm>
            </Edit>
        </Card>
    );
};