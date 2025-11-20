import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import {
    CheckboxGroupInput,
    Create,
    NumberInput,
    required,
    SelectInput,
    SimpleForm,
    TextInput,
    useNotify,
    useRedirect,
} from 'react-admin';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { colorChoices, sizeChoices, styleChoices, typeChoices } from '../../../constants/filterOptions';

const fieldStyle = {
    flex: '1 1 150px',
    width: 150,
    marginRight: 5,
    marginBottom: 2,
};

export const ProductCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    // === ẢNH ===
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    // === CHỌN ẢNH ĐẠI DIỆN ===
    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setThumbnailFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setThumbnailPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    // === CHỌN ẢNH KHÁC ===
    const handleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const selectedFiles = Array.from(files);
        setImageFiles((prev) => [...prev, ...selectedFiles]);

        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setImagesPreview((prev) => [...prev, ...previews]);
    };

    // === SUBMIT DỮ LIỆU ===
    const handleSubmit = async (data: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                notify('Vui lòng đăng nhập trước khi tạo sản phẩm', { type: 'warning' });
                return;
            }

            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('brand', data.brand || '');
            formData.append('type', data.type || '');
            formData.append('price', data.price || 0);
            formData.append('originalPrice', data.originalPrice || 0);
            formData.append('sold', data.sold || 0);
            formData.append('total', data.total || 0);
            formData.append('status', data.status || 'selling');
            formData.append('style', data.style || '');
            formData.append('description', data.description || '');
            formData.append('details', data.details || '');
            formData.append('colors', JSON.stringify(data.colors || []));
            formData.append('sizes', JSON.stringify(data.sizes || []));

            // Thêm file ảnh
            if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
            imageFiles.forEach((file) => formData.append('images', file));

            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/products`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            notify('Tạo sản phẩm thành công', { type: 'success' });
            redirect('/admin/products');
        } catch (err) {
            console.error('Upload error:', err);
            notify('Lỗi khi tạo sản phẩm', { type: 'warning' });
        }
    };

    return (
        <Card sx={{ borderRadius: '20px', mr: '-24px', height: '100%', boxShadow: 'none', overflow: 'visible' }}>
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs />
            </Box>

            <Create title="Thêm sản phẩm mới">
                <SimpleForm onSubmit={handleSubmit}>
                    {/* === THÔNG TIN CƠ BẢN === */}
                    <Box mb={2}>
                        <Typography variant="h6">Thông tin cơ bản</Typography>
                        <Divider />
                    </Box>

                    <Box display="flex" flexWrap="wrap" mb={2}>
                        <Box sx={fieldStyle}>
                            <TextInput source="name" label="Tên sản phẩm" validate={required()} fullWidth variant="outlined" />
                        </Box>
                        <Box sx={fieldStyle}>
                            <TextInput source="brand" label="Thương hiệu" fullWidth variant="outlined" />
                        </Box>
                        <Box sx={fieldStyle}>
                            <SelectInput source="style" label="Phong cách" choices={styleChoices} fullWidth variant="outlined" />
                        </Box>
                        <Box sx={{ ...fieldStyle, marginRight: 0 }}>
                            <SelectInput source="type" label="Danh mục" choices={typeChoices} fullWidth variant="outlined" />
                        </Box>
                    </Box>

                    {/* === MÔ TẢ SẢN PHẨM === */}
                    <Box mb={2}>
                        <Typography variant="h6">Mô tả sản phẩm</Typography>
                        <Divider />
                    </Box>

                    <Box mb={2}>
                        <TextInput
                            source="description"
                            label="Mô tả ngắn"
                            multiline
                            minRows={3}
                            fullWidth
                            variant="outlined"
                            helperText="Nhập mô tả ngắn gọn về sản phẩm"
                        />
                    </Box>

                    {/* === CHI TIẾT SẢN PHẨM === */}
                    <Box mb={2}>
                        <Typography variant="h6">Chi tiết sản phẩm</Typography>
                        <Divider />
                    </Box>

                    <Box mb={2}>
                        {/* ✅ Thay bằng textarea MUI */}
                        <TextInput
                            source="details"
                            label="Chi tiết sản phẩm"
                            multiline
                            minRows={4}
                            fullWidth
                            variant="outlined"
                            helperText="Nhập chi tiết sản phẩm (dưới dạng văn bản)"
                        />
                    </Box>

                    {/* === THUỘC TÍNH SẢN PHẨM === */}
                    <Box mb={2}>
                        <Typography variant="h6">Thuộc tính sản phẩm</Typography>
                        <Divider />
                    </Box>

                    <Box display="flex" gap={20} mb={2}>
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
                            sx={{ '& .MuiFormGroup-root': { flexDirection: 'column' } }}
                        />

                        <CheckboxGroupInput
                            source="sizes"
                            label="Kích cỡ"
                            choices={sizeChoices}
                            sx={{ '& .MuiFormGroup-root': { flexDirection: 'column' } }}
                        />
                    </Box>

                    {/* === GIÁ & TỒN KHO === */}
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

                    {/* === TRẠNG THÁI === */}
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

                    {/* === ẢNH === */}
                    <Box mb={2}>
                        <Typography variant="h6">Ảnh sản phẩm</Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* Ảnh đại diện */}
                        <Box display="flex" alignItems="center" mb={2}>
                            <Avatar
                                src={thumbnailPreview || 'https://via.placeholder.com/80x80?text=Thumbnail'}
                                sx={{ width: 80, height: 80, mr: 2, cursor: 'pointer' }}
                                onClick={() => thumbnailInputRef.current?.click()}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={thumbnailInputRef}
                                onChange={handleThumbnailSelect}
                            />
                            <Typography>Ảnh đại diện</Typography>
                        </Box>

                        {/* Ảnh phụ */}
                        <Box>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => imagesInputRef.current?.click()}
                                sx={{ mb: 2 }}
                            >
                                Thêm ảnh khác
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                ref={imagesInputRef}
                                onChange={handleImagesSelect}
                            />
                            <Box display="flex" gap={2} flexWrap="wrap">
                                {imagesPreview.map((src, idx) => (
                                    <Avatar key={idx} src={src} sx={{ width: 70, height: 70 }} />
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    <Typography variant="caption" color="text.secondary" mt={2}>
                        * Ngày tạo và các trường tự động sẽ không chỉnh sửa được.
                    </Typography>
                </SimpleForm>
            </Create>
        </Card>
    );
};