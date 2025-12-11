import { CalendarToday, ReceiptLong, Visibility } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import React from 'react';
import { Order } from '../../../types/Order';
import { formatCurrency, formatDate, getStatusConfig } from '../../../utils/orderHelpers';

interface OrderListItemProps {
    order: Order;
    onViewDetails: (order: Order) => void;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ order, onViewDetails }) => {
    const statusConfig = getStatusConfig(order.status);

    return (
        <Card
            elevation={0}
            variant="outlined"
            sx={{
                borderLeft: `6px solid ${statusConfig.hex}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                bgcolor: '#fff',
                borderRadius: 2
            }}
        >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={2}>

                    {/* Cột 1: Thông tin đơn hàng */}
                    <Box flex={1.5} width="100%">
                        <Stack spacing={0.5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <ReceiptLong color="action" fontSize="small" />
                                <Typography variant="subtitle1" fontWeight="bold">#{order.id}</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <CalendarToday color="action" sx={{ fontSize: 14 }} />
                                <Typography variant="body2" color="text.secondary">{formatDate(order.createdAt)}</Typography>
                            </Stack>
                        </Stack>
                    </Box>

                    {/* Cột 2: Giá tiền */}
                    <Box flex={1} width="100%" display="flex" flexDirection="column" alignItems={{ xs: 'flex-start', md: 'center' }}>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>Tổng tiền</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">{formatCurrency(order.totalPrice)}</Typography>
                    </Box>

                    {/* Cột 3: Trạng thái & Nút bấm */}
                    <Box
                        flex={1.5}
                        width="100%"
                        display="flex"
                        flexDirection={{ xs: 'row', md: 'column' }}
                        alignItems={{ xs: 'center', md: 'flex-end' }}
                        justifyContent={{ xs: 'space-between', md: 'center' }}
                        gap={1}
                    >
                        <Chip
                            label={statusConfig.label}
                            icon={statusConfig.icon}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: statusConfig.bg,
                                color: statusConfig.hex,
                                border: '1px solid transparent',
                                borderColor: `${statusConfig.hex}30`
                            }}
                        />
                        <Button
                            variant="outlined"
                            color="primary"
                            endIcon={<Visibility />}
                            size="small"
                            onClick={() => onViewDetails(order)}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 20,
                                px: 3,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2 }
                            }}
                        >
                            Xem chi tiết
                        </Button>
                    </Box>

                </Box>
            </CardContent>
        </Card>
    );
};

export default OrderListItem;
