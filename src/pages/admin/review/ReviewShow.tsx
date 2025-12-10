import {
    CalendarToday,
    Person,
    Receipt,
    ShoppingBag,
    Star
} from '@mui/icons-material';
import { Avatar, Box, Card, Chip, Divider, Paper, Rating, Typography } from '@mui/material';
import {
    DateField,
    FunctionField,
    Show,
    SimpleShowLayout,
    TextField,
    useRecordContext
} from 'react-admin';
import { Review } from '../../../types/Review';

const ReviewTitle = () => {
    const record = useRecordContext<Review>();
    return <span>Chi tiết đánh giá {record ? `"${record.productName}"` : ''}</span>;
};

import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';

export const ReviewShow = () => {
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
                <CustomBreadcrumbs />
            </Box>
            <Show
                title={<ReviewTitle />}
                sx={{
                    '& .RaShow-card': {
                        borderRadius: '16px',
                        border: 'none',
                        margin: '20px',
                        overflow: 'visible',
                        maxWidth: '800px', // Limit width for readability
                        boxShadow: 'none' // Override previous shadow
                    },
                    '& .RaSimpleShowLayout-stack': {
                        padding: 0
                    }
                }}
            >
                <SimpleShowLayout sx={{ p: 4 }}>
                    {/* Header: User & Rating */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                                <Person />
                            </Avatar>
                            <Box>
                                <FunctionField
                                    render={(record: Review) => (
                                        <Typography variant="h6" fontWeight="bold">
                                            {record.userId?.username || 'Unknown User'}
                                        </Typography>
                                    )}
                                />
                                <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                                    <CalendarToday sx={{ fontSize: 16 }} />
                                    <DateField source="createdAt" showTime options={{ year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }} />
                                </Box>
                            </Box>
                        </Box>

                        <Box textAlign="right">
                            <FunctionField
                                render={(record: Review) => (
                                    <Chip
                                        icon={<Star sx={{ "&&": { color: record.rating >= 4 ? '#fff' : 'inherit' } }} />}
                                        label={`${record.rating}/5 - ${record.rating >= 4 ? 'Tuyệt vời' : record.rating >= 3 ? 'Khá' : 'Kém'}`}
                                        color={record.rating >= 4 ? 'success' : record.rating >= 3 ? 'warning' : 'error'}
                                        sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, px: 1, mb: 1 }}
                                    />
                                )}
                            />
                            <Box display="flex" justifyContent="flex-end">
                                <FunctionField
                                    render={(record: Review) => (
                                        <Rating value={record.rating} readOnly size="medium" />
                                    )}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Content: Comment */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            bgcolor: '#f8f9fa',
                            border: '1px solid #eee',
                            borderRadius: '12px',
                            mb: 4
                        }}
                    >
                        <Box display="flex" gap={1} mb={1}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">NỘI DUNG ĐÁNH GIÁ</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#333', fontSize: '1.05rem' }}>
                            <TextField source="comment" />
                        </Typography>
                    </Paper>

                    {/* Images */}
                    <Box mb={4}>
                        <Typography variant="subtitle2" gutterBottom color="textSecondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>Hình ảnh đính kèm</Typography>
                        <FunctionField render={(record: Review) => {
                            if (record.images && Array.isArray(record.images) && record.images.length > 0) {
                                return (
                                    <Box display="flex" gap={2} flexWrap="wrap">
                                        {record.images.map((img: string, idx: number) => (
                                            <Box
                                                key={idx}
                                                component="img"
                                                src={`${import.meta.env.VITE_API_URL}${img}`}
                                                alt={`review-${idx}`}
                                                sx={{
                                                    width: 150,
                                                    height: 150,
                                                    objectFit: 'cover',
                                                    borderRadius: '12px',
                                                    border: '1px solid #eee',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                    }
                                                }}
                                                onClick={() => window.open(`${import.meta.env.VITE_API_URL}${img}`, '_blank')}
                                            />
                                        ))}
                                    </Box>
                                )
                            }
                            return (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    Không có hình ảnh
                                </Typography>
                            );
                        }} />
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* Product & Order Info (Stacked) */}
                    <Box display="flex" flexWrap="wrap" gap={6}>
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <ShoppingBag color="action" fontSize="small" />
                                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">SẢN PHẨM</Typography>
                            </Box>
                            <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                                <TextField source="productName" />
                            </Typography>
                            <Chip label={<TextField source="productCode" />} size="small" variant="outlined" sx={{ mt: 1 }} />
                        </Box>

                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Receipt color="action" fontSize="small" />
                                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">ĐƠN HÀNG</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight={500}>
                                #<TextField source="orderId" />
                            </Typography>
                        </Box>
                    </Box>

                </SimpleShowLayout>
            </Show>
        </Card>
    );
};
