import { 
    Avatar, 
    Box, 
    Card, 
    Chip, 
    Tooltip
} from '@mui/material';
import {
    BooleanField,
    DatagridConfigurable,
    DateField,
    FilterButton,
    FunctionField,
    List,
    NumberField,
    Pagination,
    TextField,
    TopToolbar,
    useRecordContext,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { productFilters } from './ProductFilter';
import { useNavigate } from 'react-router-dom';
import { Edit, Visibility } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import  DeleteIcon  from '@mui/icons-material/Delete';



const ThumbnailField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    return record ? (
        <Avatar
            variant="rounded"
            src={record[source]}
            alt={record?.name}
            sx={{ width: 48, height: 48 }}
        />
    ) : null;
};

const ColorField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    return record?.[source] ? (
        <Box display="flex" gap={1}>
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

const SizeField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    return record?.[source] ? (
        <Box display="flex" gap={0.5} flexWrap="wrap" maxWidth={150}>
            {record[source].map((size: string, index: number) => (
                <Chip key={index} label={size} size="small" />
            ))}
        </Box>
    ) : null;
};

const ListActions = () => (
    <TopToolbar>
        <FilterButton />
    </TopToolbar>
);


export const ProductList = () => {
    const navigate = useNavigate();

    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    const handleSync = async () => {
        try {
            // Nếu có API riêng để "đồng bộ dữ liệu", gọi ở đây
            await dataProvider.getList('products', {
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'DESC' },
                filter: {},
            });

            refresh(); // Gọi hook để reload lại danh sách
            notify('Đã đồng bộ thành công!', { type: 'info' });
        } catch (error) {
            console.error(error);
            notify('Đồng bộ thất bại!', { type: 'warning' });
        }
    };


    const handleCreate = () => {
        navigate('/admin/products/create');
    };

    const handleExport = () => {
        console.log('Export clicked');  
    };
    
    return (
        <Card sx={{ 
            borderRadius: "20px", 
            mr: "-24px", 
            height: "100%",
            boxShadow: 'none',
            overflow: 'hidden'
        }}>
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs 
                    onCreate={handleCreate}
                    onExport={handleExport}
                    onRefresh={handleSync}
                 />
            </Box>
            
            <List
                filters={productFilters}
                exporter={false}
                pagination={<Pagination rowsPerPageOptions={[5, 10, 25, 50]} />}
                perPage={10}
                actions={<ListActions />}
                sx={{
                    border: "2px solid #ddd",
                    borderRadius: "20px",
                    mx: "20px",
                    mb: "20px",
                    pt: "10px",
                    backgroundColor: "#fff",
                    '& .RaList-actions': {
                        mb: '20px',
                    },
                    
                }}
            
            >
                <Box sx={{ overflowX: 'auto', width: '100%' }}>
                    <Box sx={{ minWidth: '1400px' }}>

                    <DatagridConfigurable
                        bulkActionButtons={false}
                        rowClick="edit"
                        sx={{
                            '& .RaDatagrid-headerCell': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                                py: 2,
                                position: 'sticky',
                                top: 0,
                                zIndex: 1,
                            },
                            '& .RaDatagrid-rowCell': {
                                    py: 2,
                            },
                            '& .RaDatagrid-tableRow:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        }}
                        preferenceKey="product-datagrid-config-v2"
                    >
                        <TextField source="id" label="Mã SP" />
                        <ThumbnailField source="thumbnail" />
                        <TextField source="name" label="Tên sản phẩm" />
                        <TextField source="brand" label="Thương hiệu" />
                        <TextField source="category" label="Danh mục" />
                        <ColorField source="colors"/>
                        <SizeField source="sizes" />
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
                                `${Math.round((1 - record.price / record.originalPrice) * 100)}%`
                            }
                            sx={{ color: 'red', fontWeight: 'bold' }}
                        />
                        <NumberField source="sold" label="Đã bán" />
                        <NumberField source="total" label="Tồn kho" />
                        <BooleanField 
                            source="status" 
                            label="Trạng thái"
                            sx={{
                                '& .RaBooleanField-falseIcon': { color: 'error.main' },
                                '& .RaBooleanField-trueIcon': { color: 'success.main' },
                            }}
                        />
                        <DateField 
                            source="createdAt" 
                            label="Ngày tạo" 
                            options={{ day: '2-digit', month: '2-digit', year: 'numeric' }}
                            sx={{ whiteSpace: 'nowrap' }} 
                        />
                        <FunctionField
                            label="Hành động"
                            render={(record: any) => (
                                <Box sx={{ display: 'flex', gap: 0.1}}>
                                    <Tooltip title="Xem">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => navigate(`/admin/products/show?clone=${record.id}`)}
                                        >
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Sửa */}
                                    <Tooltip title="Sửa">
                                        <IconButton
                                            size="small"
                                            color="info"
                                            onClick={() => navigate(`/admin/products/${record.id}`)}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Xoá */}
                                    <Tooltip title="Xoá">
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => {
                                                if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
                                                    dataProvider.delete('products', { id: record.id })
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
                </Box>                
            </List>
        </Card>
    );
};