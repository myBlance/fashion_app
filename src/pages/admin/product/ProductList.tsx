import { Edit, Visibility } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Avatar,
    Box,
    Card,
    Chip,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    DatagridConfigurable,
    DateField,
    FilterButton,
    FunctionField,
    List,
    NumberField,
    Pagination,
    TextField,
    TopToolbar,
    useDataProvider,
    useNotify,
    useRecordContext,
    useRefresh,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { productFilters } from './ProductFilter';
import { useSidebarState } from 'react-admin';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

// 🔹 Base type cho custom field — dùng chung
interface CustomFieldProps {
    source: string;
    label?: string;          // bắt buộc để DatagridConfigurable đọc header
    cellClassName?: string;  // để style cell
    headerClassName?: string; // nếu cần style header riêng
}

// 🔹 ThumbnailField — ✅ đã thêm label, cellClassName
const ThumbnailField = ({ source, label, cellClassName }: CustomFieldProps) => {
    const record = useRecordContext();

    if (!record || !record[source]) {
        return (
            <Avatar
                variant="rounded"
                src="/no-image.png"
                alt="No image"
                className={cellClassName}
                sx={{ width: 48, height: 48 }}
            />
        );
    }

    let imageUrl = record[source];

    if (typeof imageUrl === 'object') {
        imageUrl = imageUrl.path || imageUrl.url || '';
    }

    if (typeof imageUrl === 'string' && !imageUrl.startsWith('http')) {
        imageUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${imageUrl}`;
    }

    return (
        <Avatar
            variant="rounded"
            src={imageUrl}
            alt={record?.name || 'Thumbnail'}
            className={cellClassName}
            sx={{
                width: 48,
                height: 48,
                borderRadius: '10%',
                border: '1px solid #ddd',
                backgroundColor: '#f5f5f5',
                objectFit: 'cover',
            }}
        />
    );
};

// 🔹 ColorField — ✅ đã thêm label, cellClassName
const ColorField = ({ source, label, cellClassName }: CustomFieldProps) => {
    const record = useRecordContext();
    return record?.[source] ? (
        <Box
            className={cellClassName}
            display="flex"
            gap={0.5}
            flexWrap="wrap"
            maxWidth={150}
        >
            {record[source].map((color: string, index: number) => (
                <Box
                    key={index}
                    sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: '1px solid #ddd',
                    }}
                />
            ))}
        </Box>
    ) : null;
};

// 🔹 SizeField — ✅ đã thêm label, cellClassName
const SizeField = ({ source, label, cellClassName }: CustomFieldProps) => {
    const record = useRecordContext();
    return record?.[source] ? (
        <Box
            className={cellClassName}
            display="flex"
            gap={0.5}
            flexWrap="wrap"
            maxWidth={150}
        >
            {record[source].map((size: string, index: number) => (
                <Chip key={index} label={size} size="small" />
            ))}
        </Box>
    ) : null;
};

// 🔹 DescriptionField — ✅
const DescriptionField = ({ source, label, cellClassName }: CustomFieldProps) => {
    const record = useRecordContext();
    const desc = record?.[source] || '';

    return (
        <Typography
            variant="body2"
            className={cellClassName}
            sx={{
                whiteSpace: 'normal',
                textAlign: 'left',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
                maxHeight: '3.6em',
            }}
        >
            {desc || '—'}
        </Typography>
    );
};

// 🔹 DetailsField — ✅ Đã sửa: hỗ trợ cả string và array
const DetailsField = ({ source, label, cellClassName }: CustomFieldProps) => {
    const record = useRecordContext();
    const rawDetails = record?.[source];

    if (!rawDetails) {
        return (
            <Typography variant="body2" className={cellClassName}>
                —
            </Typography>
        );
    }

    // ✅ Nếu là string → hiển thị như một dòng
    if (typeof rawDetails === 'string') {
        return (
            <Typography
                variant="body2"
                className={cellClassName}
                sx={{
                    textAlign: 'left',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {rawDetails}
            </Typography>
        );
    }

    // ✅ Nếu là mảng → hiển thị bullet list
    if (Array.isArray(rawDetails)) {
        if (rawDetails.length === 0) {
            return (
                <Typography variant="body2" className={cellClassName}>
                    —
                </Typography>
            );
        }

        const displayDetails = rawDetails.length > 3 ? [...rawDetails.slice(0, 3), '...'] : rawDetails;

        return (
            <Box className={cellClassName} sx={{ textAlign: 'left', lineHeight: 1.4 }}>
                {displayDetails.map((item, index) => (
                    <Typography
                        key={index}
                        variant="body2"
                        component="div"
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        • {item}
                    </Typography>
                ))}
            </Box>
        );
    }

    // ✅ Trường hợp khác (số, object, v.v.) → hiển thị như string
    return (
        <Typography variant="body2" className={cellClassName}>
            {String(rawDetails)}
        </Typography>
    );
};

// 🔹 categoryChoices
const categoryChoices = [
    { id: 'ao', name: 'Áo' },
    { id: 'quan', name: 'Quần' },
    { id: 'giay', name: 'Giày' },
];

// 🔹 ListActions
const ListActions = () => (
    <TopToolbar>
        <FilterButton />
    </TopToolbar>
);

// 🔹 ProductList
export const ProductList = () => {
    const [open] = useSidebarState();
    const navigate = useNavigate();
    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    const handleSync = async () => {
        try {
            await dataProvider.getList('products', {
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'DESC' },
                filter: {},
            });
            refresh();
            notify('Đã đồng bộ thành công!', { type: 'info' });
        } catch (error) {
            console.error(error);
            notify('Đồng bộ thất bại!', { type: 'warning' });
        }
    };

    const handleExport = async () => {
        try {
            const { data } = await dataProvider.getList('products', {
                pagination: { page: 1, perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
            });

            const csv = Papa.unparse(data);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, 'danh_sach_san_pham.csv');
        } catch (error) {
            console.error('Export lỗi:', error);
            notify('Xuất thất bại', { type: 'warning' });
        }
    };

    const handleCreate = () => {
        navigate('/admin/products/create');
    };

    return (
        <Card
            sx={{
                borderRadius: '20px',
                mr: '-24px',
                height: '100%',
                boxShadow: 'none',
            }}
        >
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs
                    onCreate={handleCreate}
                    onRefresh={handleSync}
                    onExport={handleExport}
                />
            </Box>

            <List
                filters={productFilters}
                exporter={false}
                pagination={<Pagination rowsPerPageOptions={[5, 10, 25, 50]} />}
                perPage={10}
                actions={<ListActions />}
                sx={{
                    border: '2px solid #ddd',
                    borderRadius: '20px',
                    mx: '20px',
                    mb: '20px',
                    pt: '10px',
                    '& .RaList-actions': {
                        mb: '20px',
                    },
                }}
            >
                <Box sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 100px)', width: open ? '1228px' : '1419px' }}>
                    <DatagridConfigurable
                        bulkActionButtons={false}
                        rowClick="edit"
                        sx={(theme) => ({
                            '& .RaDatagrid-headerCell': {
                                backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#1e1e1e',
                                fontWeight: 'bold',
                                borderTop: '1px solid #ddd',
                                borderBottom: '1px solid #ddd',
                                py: 2,
                                position: 'sticky',
                                top: 0,
                                zIndex: 1,
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            },
                            '& .RaDatagrid-rowCell': {
                                py: 2,
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            },
                            '& .RaDatagrid-rowEven': {
                                backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
                            },
                            '& .RaDatagrid-rowOdd': {
                                backgroundColor: theme.palette.mode === 'light' ? '#f7f7f7' : '#1e1e1e',
                            },
                            '& .MuiTableRow-root:hover': {
                                backgroundColor: '#edf7ff',
                            },
                            '& .sticky-actions': {
                                position: 'sticky',
                                right: 0,
                                zIndex: 10,
                                whiteSpace: 'nowrap',
                            },
                            '& .sticky-actions.RaDatagrid-rowCell::before, & .sticky-actions.RaDatagrid-headerCell::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '1px',
                                backgroundColor: theme.palette.divider,
                            },
                            '& .RaDatagrid-rowEven .sticky-actions': {
                                backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
                            },
                            '& .RaDatagrid-rowOdd .sticky-actions': {
                                backgroundColor: theme.palette.mode === 'light' ? '#f7f7f7' : '#1e1e1e',
                            },
                            '& .sticky-actions.RaDatagrid-headerCell': {
                                backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#1e1e1e',
                                zIndex: 11,
                            },
                            '& .text-left-cell': {
                                textAlign: 'left !important',
                                px: 2,
                                verticalAlign: 'top',
                            },
                            '& .text-left-cell.RaDatagrid-headerCell': {
                                textAlign: 'center !important',
                            },
                        })}
                    >
                        <TextField source="id" label="Mã sản phẩm" />
                        <ThumbnailField source="thumbnail" label="Ảnh" cellClassName="text-left-cell" />
                        <TextField source="name" label="Tên sản phẩm" sx={{ whiteSpace: 'nowrap' }} />
                        <TextField source="brand" label="Thương hiệu" sx={{ whiteSpace: 'nowrap' }} />
                        <DescriptionField source="description" label="Mô tả" cellClassName="text-left-cell" />
                        <DetailsField source="details" label="Chi tiết" cellClassName="text-left-cell" />
                        <FunctionField
                            label="Danh mục"
                            render={(record: any) => {
                                const found = categoryChoices.find((choice) => choice.id === record.category);
                                return found ? found.name : record.category;
                            }}
                        />
                        <ColorField source="colors" label="Màu" cellClassName="text-left-cell" />
                        <SizeField source="sizes" label="Size" cellClassName="text-left-cell" />
                        <NumberField
                            source="price"
                            label="Giá bán"
                            options={{ style: 'currency', currency: 'VND' }}
                            sx={{ fontWeight: 'bold' }}
                        />
                        <NumberField
                            source="originalPrice"
                            label="Giá gốc"
                            options={{ style: 'currency', currency: 'VND' }}
                        />
                        <FunctionField
                            label="Giảm giá"
                            render={(record: any) =>
                                record.originalPrice && record.price
                                    ? `${Math.round(((record.originalPrice - record.price) / record.originalPrice) * 100)}%`
                                    : '—'
                            }
                            sx={{ color: 'error.main', fontWeight: 'bold' }}
                        />
                        <NumberField source="sold" label="Đã bán" />
                        <FunctionField
                            label="Tồn kho"
                            render={(record) => (record?.total || 0) - (record?.sold || 0)}
                        />
                        <FunctionField label="Tổng số lượng" render={(record) => record?.total || 0} />
                        <FunctionField
                            label="Trạng thái"
                            render={(record) => {
                                const total = record?.total || 0;
                                const sold = record?.sold || 0;
                                const remaining = total - sold;
                                const rawStatus = record?.status;

                                let displayStatus = '';
                                if (remaining <= 0) {
                                    displayStatus = 'sold_out';
                                } else if (rawStatus === 'stopped') {
                                    displayStatus = 'stopped';
                                } else {
                                    displayStatus = 'selling';
                                }

                                const labelMap: Record<string, string> = {
                                    selling: 'Đang bán',
                                    stopped: 'Ngừng bán',
                                    sold_out: 'Hết hàng',
                                };

                                const colorMap: Record<string, 'success' | 'error' | 'default'> = {
                                    selling: 'success',
                                    stopped: 'error',
                                    sold_out: 'default',
                                };

                                return (
                                    <Chip
                                        label={labelMap[displayStatus]}
                                        color={colorMap[displayStatus]}
                                        size="small"
                                    />
                                );
                            }}
                        />
                        <DateField source="createdAt" label="Ngày tạo" sx={{ whiteSpace: 'nowrap' }} />
                        <FunctionField
                            label="Hành động"
                            cellClassName="sticky-actions"
                            headerClassName="sticky-actions"
                            render={(record: any) => (
                                <Box sx={{ display: 'flex', gap: '2px' }}>
                                    <Tooltip title="Xem">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/products/show?clone=${record.id}`);
                                            }}
                                        >
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Sửa">
                                        <IconButton
                                            size="small"
                                            color="info"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/products/${record.id}`);
                                            }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xoá">
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
                                                    dataProvider
                                                        .delete('products', { id: record.id })
                                                        .then(() => {
                                                            notify('Xoá thành công', { type: 'info' });
                                                            refresh();
                                                        })
                                                        .catch(() => {
                                                            notify('Xoá thất bại', { type: 'warning' });
                                                        });
                                                }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        />
                    </DatagridConfigurable>
                </Box>
            </List>
        </Card>
    );
};