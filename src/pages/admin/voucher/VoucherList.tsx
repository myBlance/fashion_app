import { Edit, Visibility } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
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
  useRefresh,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs'; // Điều chỉnh đường dẫn nếu cần
import { CustomAppBar } from '../../../components/Admin/CustomAppBar'; // Điều chỉnh đường dẫn nếu cần
import { useSidebarState } from 'react-admin';
import { voucherFilter } from './VoucherFilter';

// Interface cho dữ liệu voucher
interface Voucher {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  validFrom: string;
  validUntil: string;
  maxUses: number;
  maxUsesPerUser: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Action toolbar
const ListActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
);

// Main List component
export const VoucherList = () => {
  const [open] = useSidebarState();
  const navigate = useNavigate();
  const refresh = useRefresh();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const handleCreate = () => {
    navigate('/admin/vouchers/create');
  };

  const handleSync = async () => {
    try {
      await dataProvider.getList('vouchers', {
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
          onExport={undefined} // Không có export
        />
      </Box>

      <List
        filters={voucherFilter}
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
            rowClick={false} // Disable edit on click, dùng nút riêng
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
            {/* <TextField source="id" label="Mã voucher" /> */}
            <TextField source="code" label="Mã voucher" />
            <TextField source="name" label="Tên" sx={{ whiteSpace: 'nowrap' }} />
            <TextField source="description" label="Mô tả" />
            <FunctionField
              label="Loại giảm"
              render={(record: Voucher) => (
                <Typography variant="body2">
                  {record.type === 'percentage' ? `${record.value}%` : `${record.value.toLocaleString()}đ`}
                </Typography>
              )}
            />
            <NumberField source="minOrderAmount" label="Giá trị tối thiểu" options={{ style: 'currency', currency: 'VND' }} />
            <DateField source="validFrom" label="Bắt đầu" />
            <DateField source="validUntil" label="Kết thúc" />
            <NumberField source="maxUses" label="SL dùng toàn hệ thống" />
            <NumberField source="maxUsesPerUser" label="SL dùng mỗi người" />
            <FunctionField
              label="Trạng thái"
              render={(record: Voucher) => (
                <Chip
                  label={record.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                  color={record.isActive ? 'success' : 'error'}
                  size="small"
                />
              )}
            />
            <DateField source="createdAt" label="Ngày tạo" />
            <FunctionField
              label="Hành động"
              cellClassName="sticky-actions"
              headerClassName="sticky-actions"
              render={(record: Voucher) => (
                <Box sx={{ display: 'flex', gap: '2px' }}>
                  <Tooltip title="Xem">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/admin/vouchers/show?clone=${record.id}`)}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Sửa">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => navigate(`/admin/vouchers/${record.id}`)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Xoá">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => {
                        if (window.confirm('Bạn có chắc muốn xoá voucher này?')) {
                          dataProvider.delete('vouchers', { id: record.id })
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