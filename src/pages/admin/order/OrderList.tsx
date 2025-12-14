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
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };
  const colorMap: Record<string, any> = {
    pending: 'warning',
    confirmed: 'info',
    awaiting_payment: 'warning',
    paid: 'success',
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
            // 🔹 FORCE SHOW SORT ICON ALWAYS
            '& .MuiTableSortLabel-icon': {
              opacity: '1 !important',
              visibility: 'visible !important',
              display: 'block !important',
              color: 'rgba(100, 100, 100, 0.6) !important', // Neutral gray
              transition: 'transform 0.2s ease-in-out',
              marginLeft: '4px !important',
              marginRight: '0 !important',
            },
            // 🔹 Ensure arrow is always on the right
            '& .MuiButtonBase-root.MuiTableSortLabel-root': {
              flexDirection: 'row !important',
            },
            // 🔹 Fix direction for inactive headers (always point down)
            '& .MuiTableSortLabel-root:not(.Mui-active) .MuiTableSortLabel-icon': {
              transform: 'rotate(0deg) !important',
            },
            '& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon': {
              color: ({ palette }) =>
                palette.mode === 'light' ? 'rgba(0, 0, 0, 0.87) !important' : '#ffffff !important',
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
          })}
          rowClick="edit"
        >
          <TextField source="id" label="Mã đơn hàng" sortable={true} />

          {/* ✅ Sửa lại để lấy tên người dùng từ trường `user` (ref tới User) */}
          <FunctionField
            label="Khách hàng"
            sortBy="user.username"
            render={(record: any) => record.user?.name || record.user?.username || record.user?.email || 'Không rõ'}
          />

          {/* ✅ Sửa lại để hiển thị đúng tổng tiền */}
          <NumberField
            source="totalPrice"
            label="Tổng tiền"
            options={{ style: 'currency', currency: 'VND' }}
            sortable={true}
          />

          <FunctionField
            label="Vận chuyển"
            sortBy="shippingMethod"
            render={(record: any) => {
              if (record.shippingMethod === 'express') return 'Nhanh';
              if (record.shippingMethod === 'standard') return 'Tiêu chuẩn';
              return 'Mặc định';
            }}
          />

          {/* ✅ Dùng component StatusChip đã định nghĩa */}
          <FunctionField
            label="Trạng thái"
            sortBy="status"
            render={() => <StatusChip />}
          />

          <DateField source="createdAt" label="Ngày tạo" sx={{ whiteSpace: 'nowrap' }} sortable={true} />

          <FunctionField
            label="Hành động"
            cellClassName="sticky-actions"
            headerClassName="sticky-actions"
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