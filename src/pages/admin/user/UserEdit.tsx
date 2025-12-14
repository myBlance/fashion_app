import { Box, Card, Chip, Divider, Typography } from '@mui/material';
import {
    Datagrid,
    DateField,
    Edit,
    FormTab,
    FunctionField,
    NumberField,
    ReferenceManyField,
    SelectInput,
    TabbedForm,
    TextField,
    TextInput
} from 'react-admin';
import AdminRowActions from '../../../components/Admin/AdminRowActions';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';

// 🔹 Reusable Colorful Input Wrapper for Consistent "Premium" Look
const TradingInputWrapper = ({ children, color = '#1976d2', label, icon }: { children: React.ReactNode, color?: string, label?: string, icon?: React.ReactNode }) => (
    <Box sx={{ mb: 2, width: '100%' }}>
        {label && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                {icon && <Box component="span" sx={{ mr: 1, display: 'flex', color: color }}>{icon}</Box>}
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.5px' }}>
                    {label.toUpperCase()}
                </Typography>
            </Box>
        )}
        <Box sx={{
            borderLeft: `5px solid ${color}`,
            pl: 2,
            backgroundColor: '#ffffff',
            borderRadius: '0 8px 8px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.2s',
            '&:hover': {
                backgroundColor: '#fafafa',
                boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
            },
            '& .MuiFilledInput-root': { backgroundColor: 'transparent' },
        }}>
            {children}
        </Box>
    </Box>
);

const StatusChip = ({ status }: { status: string }) => {
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

export const UserEdit = () => (
    <Card sx={{ borderRadius: '20px', mr: '-24px', height: '100%', boxShadow: 'none', overflow: 'visible' }}>
        <Edit
            title="👤 Chỉnh sửa người dùng"
            mutationMode="pessimistic"
            sx={{
                '& .RaEdit-main': {
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    mt: 0
                }
            }}
        >
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs />
            </Box>

            <TabbedForm sx={{
                '& .MuiTab-root': { fontSize: '0.95rem', fontWeight: 600 },
                '& .RaTabbedForm-content': { p: 0, mt: 2 }
            }}>
                <FormTab label="Thông tin chung" path="">
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff', maxWidth: '1000px' }}>
                        <Box sx={{ p: 3 }}>
                            <Box mb={3}>
                                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>Thông tin tài khoản</Typography>
                                <Divider sx={{ my: 1 }} />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: 1, minWidth: '300px' }}>
                                    <TradingInputWrapper color="#1976d2" label="Tên đăng nhập">
                                        <TextInput source="username" fullWidth variant="outlined" label="" />
                                    </TradingInputWrapper>
                                </Box>
                                <Box sx={{ flex: 1, minWidth: '300px' }}>
                                    <TradingInputWrapper color="#ef5350" label="Email">
                                        <TextInput source="email" fullWidth variant="outlined" label="" />
                                    </TradingInputWrapper>
                                </Box>
                            </Box>

                            <Box mb={3} mt={2}>
                                <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>Chi tiết & Trạng thái</Typography>
                                <Divider sx={{ my: 1 }} />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: 1, minWidth: '250px' }}>
                                    <TradingInputWrapper color="#0288d1" label="Số điện thoại">
                                        <TextInput source="phone" fullWidth variant="outlined" label="" />
                                    </TradingInputWrapper>
                                </Box>
                                <Box sx={{ flex: 1, minWidth: '250px' }}>
                                    <TradingInputWrapper color="#ed6c02" label="Vai trò">
                                        <SelectInput
                                            source="role"
                                            choices={[
                                                { id: 'admin', name: 'Quản trị viên' },
                                                { id: 'client', name: 'Người dùng' },
                                            ]}
                                            fullWidth
                                            variant="outlined"
                                            label=""
                                        />
                                    </TradingInputWrapper>
                                </Box>
                                {/* <Box sx={{ flex: 1, minWidth: '250px' }}>
                                    <TradingInputWrapper color="#9c27b0" label="Trạng thái">
                                        <SelectInput
                                            source="status"
                                            choices={[
                                                { id: 'active', name: 'Hoạt động' },
                                                { id: 'inactive', name: 'Không hoạt động' },
                                                { id: 'banned', name: 'Bị cấm' },
                                            ]}
                                            fullWidth
                                            variant="outlined"
                                            label=""
                                        />
                                    </TradingInputWrapper>
                                </Box> */}
                            </Box>

                            <Box mt={3}>
                                <TradingInputWrapper color="#757575" label="Mã hệ thống">
                                    <TextInput source="id" disabled fullWidth variant="filled" size="small" sx={{ opacity: 0.7 }} label="" />
                                </TradingInputWrapper>
                            </Box>
                        </Box>
                    </Card>
                </FormTab>

                <FormTab label="Lịch sử mua hàng" path="order-history">
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                        <Box sx={{ p: 3 }}>
                            <Box mb={2}>
                                <Typography variant="h6">Danh sách đơn hàng đã đặt</Typography>
                                <Divider />
                            </Box>
                            <ReferenceManyField
                                reference="orders"
                                target="user"
                                label={false}
                            >
                                <Datagrid
                                    bulkActionButtons={false}
                                    rowClick="edit"
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
                                >
                                    <TextField source="id" label="Mã đơn hàng" sortable={true} />

                                    <NumberField
                                        source="totalPrice"
                                        label="Tổng tiền"
                                        options={{ style: 'currency', currency: 'VND' }}
                                        sx={{ fontWeight: 'bold', color: '#0ea5e9' }}
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

                                    <FunctionField
                                        label="Trạng thái"
                                        sortBy="status"
                                        render={(record: any) => <StatusChip status={record.status} />}
                                    />

                                    <DateField source="createdAt" label="Ngày tạo" showTime sortable={true} />

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
                                </Datagrid>
                            </ReferenceManyField>
                        </Box>
                    </Card>
                </FormTab>
            </TabbedForm>
        </Edit>
    </Card>
);
