import {
  List,
  TextField,
  DateField,
  NumberField,
  useRecordContext,
  DatagridConfigurable,
  useNotify,
  useRefresh,
  useDataProvider,
  FunctionField,
} from 'react-admin';
import { Box, Card, Chip, Tooltip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { orderFilters } from './OrderFilter';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const StatusChip = () => {
    const record = useRecordContext();
    const status = record?.status;
    const labelMap: Record<string, string> = {
        pending: 'Chờ xác nhận',
        processing: 'Đang xử lý',
        shipped: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy',
    };
    const colorMap: Record<string, any> = {
        pending: 'warning',
        processing: 'info',
        shipped: 'info',
        delivered: 'success',
        cancelled: 'error',
    };

    return (
        <Chip
            label={labelMap[status] || 'Không xác định'}
            color={colorMap[status] || 'default'}
            size='small'
        />
    );
};

export const OrderList = () => {
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
                const { data } = await dataProvider.getList('orders', {
                    pagination: { page: 1, perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });
    
                const csv = Papa.unparse(data);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                saveAs(blob, 'danh_sach_don_hang.csv');
            } catch (error) {
                console.error('Export lỗi:', error);
                notify('Xuất thất bại', { type: 'warning' });
            }
        };
    
        const handleCreate = () => {
            navigate('/admin/order/create');
        };

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
                <CustomBreadcrumbs 
                    onCreate={handleCreate}
                    onRefresh={handleSync}
                    onExport={handleExport}
                />
            </Box>
            <List
                filters={orderFilters}
                exporter={false}
                sx={{
                    border: '2px solid #ddd',
                    borderRadius: '20px',
                    mx: '20px',
                    mb: '20px',
                    pt: '10px',
                    '& .RaList-actions': {
                        mb: '20px',
                    },
                    '& .RaList-content': {
                        boxShadow: 'none',
                    },
                }}
            >
                <DatagridConfigurable
                    bulkActionButtons={false}
                    sx={(theme) => ({
                        '& .RaDatagrid-headerCell': {
                        backgroundColor:
                            theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e',
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
                    })}
                    rowClick='show'
                >
                    <TextField source='id' label='Mã đơn hàng' />

                    <FunctionField
                        label='Khách hàng'
                        render={(record: any) => record.user?.name || record.user?.email || 'Không rõ'}
                    />

                    <NumberField
                        source='totalPrice'
                        label='Tổng tiền'
                        options={{ style: 'currency', currency: 'VND' }}
                    />

                    <FunctionField
                        label='Trạng thái'
                        render={() => <StatusChip />}
                    />

                    <DateField source='createdAt' label='Ngày tạo' sx={{ whiteSpace: 'nowrap' }} />

                    <FunctionField
                        label='Hành động'
                        render={(record: any) => (
                        <Box sx={{ display: 'flex', gap: 0.1 }}>
                            <Tooltip title='Xem'>
                                <IconButton
                                    size='small'
                                    color='primary'
                                    onClick={() => navigate(`/admin/orders/${record.id}/show`)}
                                >
                                    <VisibilityIcon fontSize='small' />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title='Sửa'>
                                <IconButton
                                    size='small'
                                    color='info'
                                    onClick={() => navigate(`/admin/orders/${record.id}`)}
                                >
                                    <EditIcon fontSize='small' />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title='Xoá'>
                                <IconButton
                                    color='error'
                                    size='small'
                                    onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn xoá đơn hàng này?')) {
                                        dataProvider
                                        .delete('orders', { id: record.id })
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
            </List>
        </Card>
    );
};
