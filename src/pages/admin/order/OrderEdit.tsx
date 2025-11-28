import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
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
import { Order } from '../../../types/Order';
// === Component trạng thái đơn hàng ===
const CurrentStatus = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;

  const statusLabels: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    paid: 'Đã thanh toán',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };

  const statusColors: Record<string, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
    pending: 'warning',
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
  if (!record) return null;
  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          👤 Thông tin người dùng
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography><strong>Tên đăng nhập:</strong> {record.user?.username}</Typography>
        <Typography><strong>Email:</strong> {record.user?.email}</Typography>
      </CardContent>
    </Card>
  );
};

// === Component địa chỉ giao hàng ===
const ShippingAddress = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  const addr = record.shippingAddress;
  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          📦 Địa chỉ giao hàng
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography><strong>Họ tên:</strong> {addr.fullName}</Typography>
        <Typography><strong>SĐT:</strong> {addr.phone}</Typography>
        <Typography><strong>Địa chỉ:</strong> {addr.addressLine}</Typography>
      </CardContent>
    </Card>
  );
};

// === Component danh sách sản phẩm ===
const ProductList = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  const products = record.products || [];
  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          🛍️ Sản phẩm trong đơn
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {products.length > 0 ? (
          <Stack spacing={1}>
            {products.map((p, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  src={p.product?.image}
                  alt={p.product?.name}
                  variant="rounded"
                  sx={{ width: 56, height: 56 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {p.product?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    SL: {p.quantity} — {(p.product?.price || 0).toLocaleString()}₫
                  </Typography>
                  {(p.selectedColor || p.selectedSize) && (
                    <Typography variant="body2" color="textSecondary">
                      {p.selectedColor && `Màu: ${p.selectedColor}`} {p.selectedSize && `| Size: ${p.selectedSize}`}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="textSecondary">Không có sản phẩm</Typography>
        )}
      </CardContent>
    </Card>
  );
};

// === Component tổng tiền ===
const TotalPrice = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  return <>{record.totalPrice?.toLocaleString('vi-VN')}₫</>;
};

// === Toolbar tùy chỉnh ===
const CustomToolbar = (props: any) => (
  <Toolbar
    {...props}
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px solid #e0e0e0',
      mt: 3,
      pt: 2,
    }}
  >
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<CloseIcon />}
      onClick={() => window.history.back()}
    >
      Đóng
    </Button>
    <SaveButton
      label="Lưu thay đổi"
      variant="contained"
      color="primary"
      alwaysEnable
      sx={{ px: 3, py: 1 }}
    />
  </Toolbar>
);

// === OrderEdit ===
export const OrderEdit = (props: any) => {
  return (
    <Edit {...props} mutationMode="pessimistic" actions={false} title="Cập nhật đơn hàng">
      <SimpleForm
        record={props.record}
        toolbar={<CustomToolbar />}
        sx={{
          maxWidth: 800,
          margin: 'auto',
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Thông tin đơn hàng
        </Typography>

        <TextInput source="id" label="Mã đơn hàng" disabled fullWidth />
        <CurrentStatus />

        <SelectInput
          source="status"
          label="Trạng thái mới"
          choices={[
            { id: 'pending', name: 'Chờ xác nhận' },
            { id: 'confirmed', name: 'Đã xác nhận' },
            { id: 'paid', name: 'Đã thanh toán' },
            { id: 'processing', name: 'Đang xử lý' },
            { id: 'shipped', name: 'Đang giao' },
            { id: 'delivered', name: 'Đã giao' },
            { id: 'cancelled', name: 'Đã hủy' },
          ]}
          validate={required()}
          fullWidth
        />

        <UserInfo />
        <ShippingAddress />
        <ProductList />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            bgcolor: 'grey.100',
          }}
        >
          <Typography variant="body1">
            <strong>Tổng tiền:</strong>
          </Typography>
          <Typography variant="h6" color="primary" fontWeight={700}>
            <TotalPrice />
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={4}>
          <DateField source="createdAt" label="Ngày tạo" />
          <DateField source="updatedAt" label="Cập nhật cuối" />
        </Stack>
      </SimpleForm>
    </Edit>
  );
};
