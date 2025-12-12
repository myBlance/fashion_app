import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import {
  DateField,
  Edit,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
  useRecordContext,
} from 'react-admin';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { Order } from '../../../types/Order';
// === Component trạng thái đơn hàng ===
const CurrentStatus = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;

  const statusLabels: Record<string, string> = {
    pending: 'Chờ xác nhận',
    awaiting_payment: 'Chờ thanh toán',
    confirmed: 'Đã xác nhận',
    paid: 'Đã thanh toán',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };

  const statusColors: Record<string, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
    pending: 'warning',
    awaiting_payment: 'warning',
    confirmed: 'info',
    paid: 'success',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'error',
  };

  return (
    <Box mb={2}>
      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5 }}>
        Trạng thái hiện tại:
      </Typography>
      <Chip
        label={statusLabels[record.status] || 'Không xác định'}
        color={statusColors[record.status] || 'default'}
        size="medium"
        sx={{ fontWeight: 'bold' }}
      />
    </Box>
  );
};

// === Component thông tin người dùng ===
const UserInfo = () => {
  const record = useRecordContext<Order>();
  if (!record || !record.user) return null;

  const user = record.user;
  const isUserObject = typeof user === 'object';

  return (
    <Card elevation={0} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff', height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Box mb={2}>
          <Typography variant="h6">👤 Thông tin người dùng</Typography>
          <Divider />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>
            <strong>Tên đăng nhập:</strong> {isUserObject ? user.username : user}
          </Typography>
          <Typography>
            <strong>Email:</strong> {isUserObject ? user.email : 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

// === Component địa chỉ giao hàng ===
const ShippingAddress = () => {
  const record = useRecordContext<Order>();
  if (!record || !record.shippingAddress) return null;
  const addr = record.shippingAddress;
  return (
    <Card elevation={0} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff', height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Box mb={2}>
          <Typography variant="h6">📦 Địa chỉ giao hàng</Typography>
          <Divider />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography><strong>Họ tên:</strong> {addr.fullName || 'N/A'}</Typography>
          <Typography><strong>SĐT:</strong> {addr.phone || 'N/A'}</Typography>
          <Typography><strong>Địa chỉ:</strong> {addr.addressLine || 'N/A'}</Typography>
        </Box>
      </Box>
    </Card>
  );
};



// === Component danh sách sản phẩm ===
const ProductList = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  const products = record.products || [];
  return (
    <Card elevation={0} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
      <Box sx={{ p: 3 }}>
        <Box mb={2}>
          <Typography variant="h6">🛍️ Sản phẩm trong đơn</Typography>
          <Divider />
        </Box>
        {products.length > 0 ? (
          <Stack spacing={2}>
            {products.map((p, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f8f9fa',
                  border: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  src={p.product?.image}
                  alt={p.product?.name}
                  variant="rounded"
                  sx={{ width: 64, height: 64, border: '1px solid #ddd' }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {p.product?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    SL: {p.quantity} — {(p.product?.price || 0).toLocaleString()}₫
                  </Typography>
                  {(p.selectedColor || p.selectedSize) && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                      <Chip label={`Màu: ${p.selectedColor || 'N/A'}`} size="small" sx={{ mr: 1, height: 24 }} />
                      <Chip label={`Size: ${p.selectedSize || 'N/A'}`} size="small" sx={{ height: 24 }} />
                    </Typography>
                  )}
                </Box>
                <Typography variant="h6" color="primary.main" fontWeight={600}>
                  {((p.product?.price || 0) * p.quantity).toLocaleString()}₫
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="textSecondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
            Không có sản phẩm trong đơn hàng này
          </Typography>
        )}
      </Box>
    </Card>
  );
};

// === Component tổng tiền ===
const TotalPrice = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  return <>{(record.totalPrice || 0).toLocaleString('vi-VN')}₫</>;
};

// === Toolbar tùy chỉnh ===
const CustomToolbar = (props: any) => (
  <Toolbar
    {...props}
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px solid #e0e0e0',
      bgcolor: 'white', // Fixed bg -> bgcolor
      p: 2,
      mt: 2
    }}
  >
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<CloseIcon />}
      onClick={() => window.history.back()}
    >
      Quay lại
    </Button>
    <SaveButton
      label="Lưu thay đổi"
      variant="contained"
      color="primary"
      alwaysEnable
      sx={{ px: 4 }}
    />
  </Toolbar>
);

// === OrderEdit ===
export const OrderEdit = (props: any) => {
  return (
    <Card sx={{ borderRadius: '20px', mr: '-24px', height: '100%', boxShadow: 'none', overflow: 'visible' }}>
      <Box sx={{ padding: 2 }}>
        <CustomAppBar />
        <CustomBreadcrumbs />
      </Box>

      <Edit {...props} mutationMode="pessimistic" actions={false} title="Cập nhật đơn hàng" sx={{ '& .RaEdit-main': { bgcolor: 'transparent', boxShadow: 'none' } }}>
        <SimpleForm
          record={props.record}
          toolbar={<CustomToolbar />}
          sx={{
            maxWidth: 1000,
            margin: '0 auto',
            pb: 5
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>

            {/* === THÔNG TIN CHUNG === */}
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
              <Box sx={{ p: 3 }}>
                <Box mb={2}>
                  <Typography variant="h6">Thông tin chung</Typography>
                  <Divider />
                </Box>

                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <TextInput source="id" label="Mã đơn hàng" disabled fullWidth variant="outlined" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <SelectInput
                      source="status"
                      label="Trạng thái đơn hàng"
                      choices={[
                        { id: 'pending', name: 'Chờ xác nhận' },
                        { id: 'awaiting_payment', name: 'Chờ thanh toán' },
                        { id: 'confirmed', name: 'Đã xác nhận' },
                        { id: 'paid', name: 'Đã thanh toán' },
                        { id: 'processing', name: 'Đang xử lý' },
                        { id: 'shipped', name: 'Đang giao' },
                        { id: 'delivered', name: 'Đã giao' },
                        { id: 'cancelled', name: 'Đã hủy' },
                      ]}
                      validate={required()}
                      fullWidth
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ flex: 1, pt: 1 }}>
                    <CurrentStatus />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Khách thanh toán:</Typography>
                  <Typography variant="h5" color="error.main" fontWeight={700}>
                    <TotalPrice />
                  </Typography>
                </Box>
              </Box>
            </Card>

            <Stack direction="row" spacing={3} width="100%">
              <Box flex={1}>
                <UserInfo />
              </Box>
              <Box flex={1}>
                <ShippingAddress />
              </Box>
            </Stack>
            <ProductList />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, px: 1 }}>
              <DateField source="createdAt" label="Ngày tạo" showTime />
              <DateField source="updatedAt" label="Cập nhật cuối" showTime />
            </Box>

          </Box>
        </SimpleForm>
      </Edit>
    </Card>
  );
};
