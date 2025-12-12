import { Box, Card, Chip } from '@mui/material';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import {
  DatagridConfigurable,
  DateField,
  FunctionField,
  List,
  NumberField,
  TextField,
  useDataProvider,
  useNotify,
  useRecordContext,
  useRefresh,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import AdminRowActions from '../../../components/Admin/AdminRowActions';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { orderFilters } from './OrderFilter';

const StatusChip = () => {
  const record = useRecordContext();
  const status = record?.status;
  const labelMap: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    awaiting_payment: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };
  const colorMap: Record<string, any> = {
    pending: 'warning',
    confirmed: 'info',
    awaiting_payment: 'warning',
    paid: 'success',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'error',
  };

  return (
    <Chip
      label={labelMap[status] || 'Không xác định'}
      color={colorMap[status] || 'default'}
      size="small"
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
    navigate('/admin/orders/create');
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
          rowClick="edit"
        >
          <TextField source="id" label="Mã đơn hàng" />

          {/* ✅ Sửa lại để lấy tên người dùng từ trường `user` (ref tới User) */}
          <FunctionField
            label="Khách hàng"
            render={(record: any) => record.user?.name || record.user?.username || record.user?.email || 'Không rõ'}
          />

          {/* ✅ Sửa lại để hiển thị đúng tổng tiền */}
          <NumberField
            source="totalPrice"
            label="Tổng tiền"
            options={{ style: 'currency', currency: 'VND' }}
          />

          <FunctionField
            label="Vận chuyển"
            render={(record: any) => {
              if (record.shippingMethod === 'express') return 'Nhanh';
              if (record.shippingMethod === 'standard') return 'Tiêu chuẩn';
              return 'Mặc định';
            }}
          />

          {/* ✅ Dùng component StatusChip đã định nghĩa */}
          <FunctionField
            label="Trạng thái"
            render={() => <StatusChip />}
          />

          <DateField source="createdAt" label="Ngày tạo" sx={{ whiteSpace: 'nowrap' }} />

          <FunctionField
            label="Hành động"
            render={(record: any) => (
              <AdminRowActions
                record={record}
                resource="orders"
              />
            )}
          />
        </DatagridConfigurable>
      </List>
    </Card>
  );
};