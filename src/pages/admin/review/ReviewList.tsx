import {
  Box,
  Card,
  Chip,
  Typography
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
  useNotify,
  useRefresh,
  useSidebarState
} from 'react-admin';
import AdminRowActions from '../../../components/Admin/AdminRowActions';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { Review } from '../../../types/Review';
import { reviewFilters } from './ReviewFilter';

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
);

export const ReviewList = () => {
  const [open] = useSidebarState();
  const refresh = useRefresh();
  const notify = useNotify();

  const handleCreate = () => {
    // Nếu có trang tạo đánh giá
    // navigate('/admin/reviews/create');
  };

  const handleSync = async () => {
    try {
      refresh();
      notify('Đã đồng bộ thành công!', { type: 'info' });
    } catch (error) {
      notify('Đồng bộ thất bại!', { type: 'warning' });
    }
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
        />
      </Box>

      <List
        resource="reviews"
        filters={reviewFilters}
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
            rowClick="show"
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
            })}
          >
            <TextField source="userId.username" label="Người dùng" />
            <FunctionField
              label="Mã sản phẩm"
              render={(record: Review) => (
                <Typography noWrap sx={{ maxWidth: 150 }}>
                  {record.productCode || record.productId}
                </Typography>
              )}
            />
            <FunctionField
              label="Tên sản phẩm"
              render={(record: Review) => (
                <Typography noWrap sx={{ maxWidth: 200 }}>
                  {record.productName || record.productId}
                </Typography>
              )}
            />
            <TextField source="orderId" label="Mã đơn hàng" />
            <NumberField source="rating" label="Đánh giá" />
            <FunctionField
              label="Bình luận"
              render={(record: Review) => (
                <Typography noWrap sx={{ maxWidth: 200 }}>
                  {record.comment.substring(0, 50)}...
                </Typography>
              )}
            />
            <DateField source="createdAt" label="Ngày tạo" />
            <FunctionField
              label="Trạng thái"
              render={(record: Review) => (
                <Chip
                  label={record.rating >= 4 ? "Tốt" : record.rating >= 3 ? "TB" : "Kém"}
                  color={record.rating >= 4 ? "success" : record.rating >= 3 ? "warning" : "error"}
                  size="small"
                />
              )}
            />
            <FunctionField
              label="Hành động"
              cellClassName="sticky-actions"
              headerClassName="sticky-actions"
              render={(record: Review) => (
                <AdminRowActions
                  record={record}
                  resource="reviews"
                />
              )}
            />
          </DatagridConfigurable>
        </Box>
      </List>
    </Card>
  );
};