import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  useRecordContext,
} from 'react-admin';
import { Box, Chip, Typography, Divider } from '@mui/material';

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

    return <Chip label={labelMap[status] || 'Không rõ'} color={colorMap[status] || 'default'} />;
};

export const OrderShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField source='id' label='Mã đơn hàng' />

                <FunctionField
                    label='Khách hàng'
                    render={(record: any) =>
                        record.user?.name
                        ? `${record.user.name} (${record.user.email})`
                        : record.user?.email || 'Không rõ'
                    }
                />

                <NumberField
                    source='totalPrice'
                    label='Tổng tiền'
                    options={{ style: 'currency', currency: 'VND' }}
                />

                <FunctionField label='Trạng thái' render={() => <StatusChip />} />

                <DateField source='createdAt' label='Ngày tạo' />

                <Divider sx={{ my: 2 }} />
                <Typography variant='h6'>Sản phẩm đã đặt</Typography>
                <FunctionField
                    render={(record: any) => (
                        <Box sx={{ pl: 2 }}>
                            {record.products?.map((item: any, index: number) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Typography>
                                        <strong>Tên sản phẩm:</strong> {item.product?.name || 'Không rõ'}
                                    </Typography>
                                    <Typography>
                                        <strong>Số lượng:</strong> {item.quantity}
                                    </Typography>
                                        {item.selectedColor && (
                                            <Typography>
                                            <strong>Màu:</strong> {item.selectedColor}
                                            </Typography>
                                        )}
                                        {item.selectedSize && (
                                            <Typography>
                                            <strong>Size:</strong> {item.selectedSize}
                                            </Typography>
                                        )}
                                    <Typography>
                                        <strong>Giá:</strong>{' '}
                                        {item.price !== undefined && item.price !== null
                                            ? new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(item.price)
                                            : 'Không rõ'}
                                    </Typography>

                                </Box>
                            ))}
                        </Box>
                    )}
                />

                <Divider sx={{ my: 2 }} />
                <Typography variant='h6'>Địa chỉ giao hàng</Typography>
                <FunctionField
                    render={(record: any) => (
                        <Box sx={{ pl: 2 }}>
                            <Typography><strong>Họ tên:</strong> {record.shippingAddress?.fullName}</Typography>
                            <Typography><strong>SĐT:</strong> {record.shippingAddress?.phone}</Typography>
                            <Typography><strong>Địa chỉ:</strong> {record.shippingAddress?.addressLine}</Typography>
                            <Typography><strong>Phường/Xã:</strong> {record.shippingAddress?.ward}</Typography>
                            <Typography><strong>Quận/Huyện:</strong> {record.shippingAddress?.district}</Typography>
                            <Typography><strong>Tỉnh/TP:</strong> {record.shippingAddress?.city}</Typography>
                            {record.shippingAddress?.note && (
                                <Typography><strong>Ghi chú:</strong> {record.shippingAddress?.note}</Typography>
                            )}
                        </Box>
                    )}
                />
            </SimpleShowLayout>
        </Show>
    );
};
