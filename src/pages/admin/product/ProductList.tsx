import { Edit, Visibility } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Avatar,
    Box,
    Card,
    Chip,
    IconButton,
    Tooltip
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


const ThumbnailField = ({ source }: { source: string, label: string }) => {
    const record = useRecordContext();

    if (!record || !record[source]) return null;

    const value = record[source];
    const imageUrl = Array.isArray(value) ? value[0] : value;

    return (
        <Avatar
            variant='rounded'
            src={imageUrl}
            alt={record?.name || ''}
            sx={{ width: 48, height: 48 }}
        />
    );
};


const ColorField = ({ source }: { source: string, label: string }) => {
    const record = useRecordContext();
    return record?.[source] ? (
        <Box display='flex'  gap={0.5} flexWrap='wrap' maxWidth={150}>
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

const SizeField = ({ source }: { source: string, label: string }) => {
    const record = useRecordContext();
    return record?.[source] ? (
        <Box display='flex' gap={0.5} flexWrap='wrap' maxWidth={150}>
            {record[source].map((size: string, index: number) => (
                <Chip key={index} label={size} size='small' />
            ))}
        </Box>
    ) : null;
};

const categoryChoices = [
    { id: 'ao', name: 'Áo' },
    { id: 'quan', name: 'Quần' },
    { id: 'giay', name: 'Giày' },
];

const ListActions = () => (
    <TopToolbar>
        <FilterButton />
    </TopToolbar>
);


export const ProductList = () => {
   

const [open] = useSidebarState();
    const navigate = useNavigate();

    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    const handleSync = async () => {
        try {
            // Nếu có API riêng để 'đồng bộ dữ liệu', gọi ở đây
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
                        rowClick='edit'
                        sx={(theme) => ({
                            '& .RaDatagrid-headerCell': {
                                backgroundColor:
                                    theme.palette.mode === 'light' ? '#f0f0f0' : '#1e1e1e',
                                fontWeight: 'bold',
                                borderTop: '1px solid #ddd',
                                borderBottom: '1px soild #ddd',
                                py: 2,
                                position: 'sticky',
                                top: 0,
                                zIndex: 1,
                                whiteSpace: 'nowrap',
                                textAlign: 'center',                 //  căn giữa ngang
                                verticalAlign: 'middle',             //  căn giữa dọc
                            },
                            '& .RaDatagrid-rowCell': {
                                py: 2,
                                textAlign: 'center',                 
                                verticalAlign: 'middle',             
                            },
                            '& .RaDatagrid-rowEven': { 
                                backgroundColor: 
                                    theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
                            }, 
                            '& .RaDatagrid-rowOdd': { 
                                backgroundColor:
                                    theme.palette.mode === 'light' ? '#f7f7f7' : '#1e1e1e',
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
                                backgroundColor:
                                    theme.palette.mode === 'light' ? '#f0f0f0' : '#1e1e1e',
                                zIndex: 11,
                            },
  

                        })}
                    >
                        <TextField source='id' label='Mã sản phẩm' />
                        <ThumbnailField source='thumbnail' label='Ảnh'/>
                        <TextField source='name' label='Tên sản phẩm' sx={{ whiteSpace: 'nowrap' }}/>
                        <TextField source='brand' label='Thương hiệu' sx={{ whiteSpace: 'nowrap' }}/>
                        <FunctionField
                            label='Danh mục'
                            render={(record: any) => {
                                const found = categoryChoices.find(choice => choice.id === record.category);
                                return found ? found.name : record.category;
                            }}
                        />


                        <ColorField source='colors' label='Màu'/>
                        <SizeField source='sizes' label='Size'/>
                        <NumberField 
                            source='price' 
                            label='Giá bán'
                            options={{ style: 'currency', currency: 'VND' }}
                            sx={{ fontWeight: 'bold' }}
                        />
                        <NumberField 
                            source='originalPrice' 
                            label='Giá gốc'
                            options={{ style: 'currency', currency: 'VND' }}
                        />
                        <FunctionField 
                            label='Giảm giá'
                            render={(record: any) =>
                                `${Math.round((1 - record.price / record.originalPrice) * 100)}%`
                            }
                            sx={{ color: 'red', fontWeight: 'bold' }}
                        />
                        
                        <NumberField source='sold' label='Đã bán' />

                        <FunctionField
                            label='Tồn kho'
                            render={record => (record?.total || 0) - (record?.sold || 0)}
                        />

                        <FunctionField
                            label='Tổng số lượng'
                            render={record => (record?.total || 0)}
                        />

                        <FunctionField
                            label='Trạng thái'
                            render={record => {
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
                                        size='small'
                                    />
                                );
                            }}
                        />


                        <DateField 
                            source='createdAt' 
                            label='Ngày tạo' 
                            sx={{ whiteSpace: 'nowrap' }} 
                        />
                        <FunctionField
                            label='Hành động'
                            cellClassName='sticky-actions'
                            headerClassName='sticky-actions'
                            render={(record: any) => (
                                <Box sx={{ display: 'flex', gap: '2px'}}>
                                    <Tooltip title='Xem'>
                                        <IconButton
                                            size='small'
                                            color='primary'
                                            onClick={() => navigate(`/admin/products/show?clone=${record.id}`)}
                                        >
                                            <Visibility fontSize='small' />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Sửa */}
                                    <Tooltip title='Sửa'>
                                        <IconButton
                                            size='small'
                                            color='info'
                                            onClick={() => navigate(`/admin/products/${record.id}`)}
                                        >
                                            <Edit fontSize='small' />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Xoá */}
                                    <Tooltip title='Xoá'>
                                        <IconButton
                                            color='error'
                                            size='small'
                                            onClick={() => {
                                                if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
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
                                            <DeleteIcon fontSize='small' />
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