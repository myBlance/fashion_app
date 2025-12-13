import CloseIcon from '@mui/icons-material/Close';
import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    IconButton,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import {
    CheckboxGroupInput,
    Create,
    minValue,
    NumberInput,
    required,
    SelectArrayInput,
    SelectInput,
    SimpleForm,
    TextInput,
    useNotify,
    useRedirect
} from 'react-admin';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { colorChoices, sizeChoices, styleChoices, typeChoices } from '../../../constants/filterOptions';



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
    const handleRemoveThumbnail = () => {
        setThumbnailPreview(null);
        setThumbnailFile(null);
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    };

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

    const handleRemoveImage = (index: number) => {
        setImagesPreview((prev) => prev.filter((_, i) => i !== index));
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
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
            formData.append('style', JSON.stringify(data.style || []));
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
                <SimpleForm onSubmit={handleSubmit} sx={{ maxWidth: '1200px', margin: '0 auto', pb: 5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>

                        {/* === THÔNG TIN CƠ BẢN & MÔ TẢ === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'visible', bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6">Thông tin sản phẩm</Typography>
                                    <Divider />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 2, minWidth: '300px' }}>
                                        <TextInput source="name" validate={required()} fullWidth variant="outlined" label="Tên sản phẩm" placeholder="Nhập tên sản phẩm..." />
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                                        <TextInput source="brand" defaultValue="Dola Style" fullWidth variant="outlined" label="Thương hiệu" placeholder="Thương hiệu..." />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mt: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <SelectInput source="type" choices={typeChoices} fullWidth variant="outlined" label="Danh mục" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <SelectArrayInput
                                            source="style"
                                            choices={styleChoices}
                                            fullWidth
                                            variant="outlined"
                                            label="Phong cách"
                                            optionText="name"
                                            optionValue="id"
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextInput source="description" multiline minRows={2} fullWidth variant="outlined" label="Mô tả ngắn" />
                                    <TextInput source="details" multiline minRows={4} fullWidth variant="outlined" label="Chi tiết sản phẩm" />
                                </Box>
                            </Box>
                        </Card>

                        {/* === GIÁ & TỒN KHO === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6">Giá & Kho hàng</Typography>
                                    <Divider />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <NumberInput source="price" fullWidth variant="outlined" min={0} validate={[required(), minValue(0)]} label="Giá Bán" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <NumberInput source="originalPrice" fullWidth variant="outlined" min={0} validate={[required(), minValue(0)]} label="Giá Gốc" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <NumberInput source="total" fullWidth variant="outlined" min={0} validate={[minValue(0)]} label="Tổng kho" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <NumberInput source="sold" fullWidth variant="outlined" min={0} validate={[minValue(0)]} label="Đã bán" />
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
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
                            </Box>
                        </Card>

                        {/* === THUỘC TÍNH (Màu/Size) === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6">Phân loại hàng</Typography>
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

                        {/* === HÌNH ẢNH === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6">Hình ảnh sản phẩm</Typography>
                                    <Divider />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4 }}>
                                    <Box sx={{ textAlign: 'center', position: 'relative', display: 'inline-block' }}>
                                        <Avatar
                                            src={thumbnailPreview || 'https://via.placeholder.com/150x150?text=Upload'}
                                            sx={{ width: 120, height: 120, mb: 2, cursor: 'pointer', border: '2px dashed #ccc' }}
                                            onClick={() => thumbnailInputRef.current?.click()}
                                            variant="rounded"
                                        />
                                        {thumbnailPreview && (
                                            <IconButton
                                                size="small"
                                                onClick={handleRemoveThumbnail}
                                                sx={{
                                                    position: 'absolute',
                                                    top: -8,
                                                    right: -8,
                                                    bgcolor: 'white',
                                                    boxShadow: 1,
                                                    '&:hover': { bgcolor: '#f5f5f5' }
                                                }}
                                            >
                                                <CloseIcon fontSize="small" color="error" />
                                            </IconButton>
                                        )}
                                        <input type="file" accept="image/*" hidden ref={thumbnailInputRef} onChange={handleThumbnailSelect} />
                                        <Button size="small" variant="outlined" onClick={() => thumbnailInputRef.current?.click()}>
                                            Ảnh bìa
                                        </Button>
                                    </Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                            {imagesPreview.map((src, idx) => (
                                                <Box key={idx} sx={{ position: 'relative' }}>
                                                    <Avatar src={src} variant="rounded" sx={{ width: 100, height: 100, border: '1px solid #eee' }} />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveImage(idx)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -8,
                                                            right: -8,
                                                            bgcolor: 'white',
                                                            boxShadow: 1,
                                                            '&:hover': { bgcolor: '#f5f5f5' }
                                                        }}
                                                    >
                                                        <CloseIcon fontSize="small" color="error" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                            <Box
                                                sx={{
                                                    width: 100, height: 100,
                                                    border: '2px dashed #ccc', borderRadius: 2,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    color: 'text.secondary',
                                                    '&:hover': { bgcolor: '#f5f5f5' }
                                                }}
                                                onClick={() => imagesInputRef.current?.click()}
                                            >
                                                + Thêm
                                            </Box>
                                        </Box>
                                        <input type="file" accept="image/*" multiple hidden ref={imagesInputRef} onChange={handleImagesSelect} />
                                    </Box>
                                </Box>
                            </Box>
                        </Card>

                        <Typography variant="caption" color="text.secondary" mt={2}>
                            * Ngày tạo và các trường tự động sẽ không chỉnh sửa được.
                        </Typography>
                    </Box>
                </SimpleForm>
            </Create>
        </Card>
    );
};