import CloseIcon from '@mui/icons-material/Close';
import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
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
import { useFormContext, useWatch } from 'react-hook-form';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { colorChoices, sizeChoices, styleChoices, typeChoices } from '../../../constants/filterOptions';

// 🔹 Reusable Colorful Input Wrapper
const TradingInputWrapper = ({ children, color = '#1976d2', label, icon }: { children: React.ReactNode, color?: string, label?: string, icon?: React.ReactNode }) => (
    <Box sx={{ mb: 2, width: '100%' }}>
        {label && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                {icon && <Box component="span" sx={{ mr: 1, display: 'flex', color: color }}>{icon}</Box>}
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.5px' }}>
                    {label.toUpperCase()}
                </Typography>
            </Box>
        )}
        <Box sx={{
            borderLeft: `5px solid ${color}`,
            pl: 2,
            backgroundColor: '#ffffff',
            borderRadius: '0 8px 8px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.2s',
            '&:hover': {
                backgroundColor: '#fafafa',
                boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
            },
            '& .MuiFilledInput-root': { backgroundColor: 'transparent' },
        }}>
            {children}
        </Box>
    </Box>
);

// 🔹 Variant Interface
interface Variant {
    color: string;
    size: string;
    quantity: number;
    sold?: number;
}

// 🔹 Variants Table Component
const VariantsTable = () => {
    const { control, setValue } = useFormContext();
    const colors = useWatch({ control, name: 'colors' }) || [];
    const sizes = useWatch({ control, name: 'sizes' }) || [];

    // Local Sorting State - Moved to top level
    const [sortConfig, setSortConfig] = useState<{ key: 'color' | 'size' | 'quantity', direction: 'asc' | 'desc' }>({ key: 'color', direction: 'asc' });

    // Watch all variant quantities to calculate total
    const formData = useWatch({ control });

    // Calculate total whenever variants change
    useEffect(() => {
        let newTotal = 0;
        if (Array.isArray(colors) && Array.isArray(sizes)) {
            colors.forEach(color => {
                sizes.forEach(size => {
                    const key = `variants_matrix.${color}_${size}`;
                    const qty = Number(formData[key] || 0);
                    newTotal += qty;
                });
            });
        }
        // Only update if different to avoid loop (though react-hook-form handles it well)
        if (formData.total !== newTotal) {
            setValue('total', newTotal);
        }
    }, [formData, colors, sizes, setValue]);

    if (!colors.length || !sizes.length) return null;

    // Generate Rows
    let rows: { color: string, size: string, colorName: string, sizeName: string, qty: number }[] = [];
    colors.forEach((color: string) => {
        sizes.forEach((size: string) => {
            const key = `variants_matrix.${color}_${size}`;
            const qty = Number(formData[key] || 0);
            const colorName = colorChoices.find(c => c.id === color)?.name || color;
            const sizeName = sizeChoices.find(s => s.id === size)?.name || size;
            rows.push({ color, size, colorName, sizeName, qty });
        });
    });

    // Handle Sort
    const handleSort = (key: 'color' | 'size' | 'quantity') => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Apply Sort
    rows.sort((a, b) => {
        if (sortConfig.key === 'quantity') {
            return sortConfig.direction === 'asc' ? a.qty - b.qty : b.qty - a.qty;
        }
        const valA = sortConfig.key === 'color' ? a.colorName : a.sizeName;
        const valB = sortConfig.key === 'color' ? b.colorName : b.sizeName;
        return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return (
        <TableContainer component={Paper} elevation={0} sx={{ mt: 3, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small" sx={{ '& .MuiTableCell-root': { py: 1.5 } }}>
                <TableHead sx={{ bgcolor: '#f4f6f8' }}>
                    <TableRow>
                        <TableCell
                            onClick={() => handleSort('color')}
                            sx={{ fontWeight: 'bold', color: '#637381', fontSize: '13px', cursor: 'pointer', userSelect: 'none', '&:hover': { color: '#000' } }}
                        >
                            MÀU SẮC {sortConfig.key === 'color' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('size')}
                            sx={{ fontWeight: 'bold', color: '#637381', fontSize: '13px', cursor: 'pointer', userSelect: 'none', '&:hover': { color: '#000' } }}
                        >
                            KÍCH CỠ {sortConfig.key === 'size' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell
                            align="center"
                            width={150}
                            onClick={() => handleSort('quantity')}
                            sx={{ fontWeight: 'bold', color: '#637381', fontSize: '13px', cursor: 'pointer', userSelect: 'none', '&:hover': { color: '#000' } }}
                        >
                            SỐ LƯỢNG {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={`${row.color}-${row.size}`} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        bgcolor: row.color,
                                        border: '1px solid #ddd',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                    }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px' }}>
                                        {row.colorName}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px' }}>
                                    {row.sizeName}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <NumberInput
                                    source={`variants_matrix.${row.color}_${row.size}`}
                                    label=""
                                    variant="outlined"
                                    size="small"
                                    min={0}
                                    defaultValue={0}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            bgcolor: '#fff',
                                            '& input': { textAlign: 'center', py: 0.8 }
                                        },
                                        width: '120px'
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
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


            // 🔹 Construct Variants
            const variants: Variant[] = [];
            let calculatedTotal = 0;
            if (data.colors && data.sizes) {
                data.colors.forEach((color: string) => {
                    data.sizes.forEach((size: string) => {
                        // Access nested variants_matrix object
                        const matrixKey = `${color}_${size}`;
                        const qtyFromForm = data.variants_matrix ? data.variants_matrix[matrixKey] : undefined;
                        const qty = Number(qtyFromForm ?? data[`variants_matrix.${matrixKey}`] ?? 0);

                        if (qty > 0) {
                            variants.push({
                                color,
                                size,
                                quantity: qty,
                                sold: 0
                            });
                            calculatedTotal += qty;
                        }
                    });
                });
            }

            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('brand', data.brand || 'Dola Style');
            formData.append('type', data.type || '');
            formData.append('price', data.price || 0);
            formData.append('importPrice', data.importPrice || 0);
            formData.append('originalPrice', data.originalPrice || 0);

            // Use calculated total if variants exist, otherwise use manual total (or 0)
            formData.append('total', variants.length > 0 ? calculatedTotal : (data.total || 0));
            formData.append('sold', data.sold || 0);

            formData.append('status', data.status || 'selling');
            formData.append('style', JSON.stringify(data.style || []));
            formData.append('description', data.description || '');
            formData.append('details', data.details || '');

            formData.append('colors', JSON.stringify(data.colors || []));
            formData.append('sizes', JSON.stringify(data.sizes || []));

            // 🔹 Append Variants
            formData.append('variants', JSON.stringify(variants));

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
                                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>Thông tin sản phẩm</Typography>
                                    <Divider sx={{ my: 1 }} />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 2, minWidth: '300px' }}>
                                        <TradingInputWrapper color="#00bcd4" label="Tên sản phẩm">
                                            <TextInput source="name" validate={required()} fullWidth variant="outlined" label="" placeholder="Nhập tên sản phẩm..." />
                                        </TradingInputWrapper>
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                                        <TradingInputWrapper color="#673ab7" label="Thương hiệu">
                                            <TextInput source="brand" defaultValue="Dola Style" fullWidth variant="outlined" label="" placeholder="Thương hiệu..." />
                                        </TradingInputWrapper>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <TradingInputWrapper color="#e91e63" label="Danh mục">
                                            <SelectInput source="type" choices={typeChoices} fullWidth variant="outlined" label="" />
                                        </TradingInputWrapper>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <TradingInputWrapper color="#9c27b0" label="Phong cách">
                                            <SelectArrayInput
                                                source="style"
                                                choices={styleChoices}
                                                fullWidth
                                                variant="outlined"
                                                label=""
                                                optionText="name"
                                                optionValue="id"
                                            />
                                        </TradingInputWrapper>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 1 }}>
                                    <TradingInputWrapper color="#607d8b" label="Mô tả & Chi tiết">
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <TextInput source="description" multiline minRows={2} fullWidth variant="outlined" label="Mô tả ngắn" />
                                            <TextInput source="details" multiline minRows={4} fullWidth variant="outlined" label="Chi tiết sản phẩm" />
                                        </Box>
                                    </TradingInputWrapper>
                                </Box>
                            </Box>
                        </Card>

                        {/* === GIÁ & TỒN KHO === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>Giá & Kho hàng</Typography>
                                    <Divider sx={{ my: 1 }} />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <TradingInputWrapper color="#2e7d32" label="Giá Bán (VND)">
                                            <NumberInput source="price" fullWidth variant="outlined" min={0} validate={[required(), minValue(0)]} label="" />
                                        </TradingInputWrapper>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <TradingInputWrapper color="#c62828" label="Giá Nhập (VND)">
                                            <NumberInput source="importPrice" fullWidth variant="outlined" min={0} validate={[required(), minValue(0)]} label="" />
                                        </TradingInputWrapper>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <TradingInputWrapper color="#ff9800" label="Giá Gốc (VND)">
                                            <NumberInput source="originalPrice" fullWidth variant="outlined" min={0} validate={[required(), minValue(0)]} label="" />
                                        </TradingInputWrapper>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <TradingInputWrapper color="#795548" label="Tổng kho (Tự động)">
                                            <NumberInput source="total" fullWidth variant="outlined" min={0} disabled label="" />
                                        </TradingInputWrapper>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <TradingInputWrapper color="#8d6e63" label="Đã bán">
                                            <NumberInput source="sold" fullWidth variant="outlined" min={0} validate={[minValue(0)]} label="" />
                                        </TradingInputWrapper>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <TradingInputWrapper color="#4caf50" label="Trạng thái">
                                            <SelectInput
                                                source="status"
                                                label=""
                                                variant="outlined"
                                                choices={[
                                                    { id: 'selling', name: 'Đang bán' },
                                                    { id: 'stopped', name: 'Ngừng bán' },
                                                    { id: 'sold_out', name: 'Hết hàng' },
                                                ]}
                                                fullWidth
                                            />
                                        </TradingInputWrapper>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>

                        {/* === THUỘC TÍNH (Màu/Size) === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6" sx={{ color: '#009688', fontWeight: 600 }}>Phân loại hàng</Typography>
                                    <Divider sx={{ my: 1 }} />
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

                                {/* 🔹 Variant Matrix Table */}
                                <VariantsTable />

                            </Box>
                        </Card>

                        {/* === HÌNH ẢNH === */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 600 }}>Hình ảnh sản phẩm</Typography>
                                    <Divider sx={{ my: 1 }} />
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