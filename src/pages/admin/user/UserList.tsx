import {
    Box,
    Card,
    Chip
} from '@mui/material';
import {
    DatagridConfigurable,
    DateField,
    EmailField,
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
import { User } from '../../../types/User';
import { userFilters } from './UserFilter';

// Action toolbar
const ListActions = () => (
    <TopToolbar>
        <FilterButton />
    </TopToolbar>
);



export const UserList = () => {
    const [open] = useSidebarState();
    // const navigate = useNavigate();
    const refresh = useRefresh();
    const notify = useNotify();

    // const handleCreate = () => {
    //     navigate('/admin/users/create'); // Assuming we might add create later
    // };

    const handleSync = () => {
        refresh();
        notify('Đã làm mới danh sách!', { type: 'info' });
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
                    onRefresh={handleSync}
                // onCreate={handleCreate} // Uncomment when create is ready
                />
            </Box>

            <List
                title="Users"
                filters={userFilters}
                resource="users"
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
                        <TextField source="username" label="Tên đăng nhập" sortable={true} />
                        <EmailField source="email" label="Email" sortable={true} />
                        <TextField source="phone" label="Số điện thoại" sortable={true} />

                        <NumberField source="totalProductsBought" label="Đã mua" sortable={true} />
                        <NumberField source="totalReviews" label="Đánh giá" sortable={true} />
                        <NumberField
                            source="totalSpent"
                            label="Tổng chi tiêu"
                            options={{ style: 'currency', currency: 'VND' }}
                            sortable={true}
                            sx={{ fontWeight: 'bold', color: '#1c79dc' }}
                        />

                        <FunctionField
                            label="Vai trò"
                            sortBy="role"
                            render={(record: User) => (
                                <Chip
                                    label={record.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                    color={record.role === 'admin' ? 'primary' : 'default'}
                                    size="small"
                                />
                            )}
                        />

                        {/* <FunctionField
                            label="Trạng thái"
                            sortBy="status"
                            render={(record: User) => (
                                <Chip
                                    label={record.status === 'active' ? 'Hoạt động' : record.status === 'banned' ? 'Bị cấm' : 'Không hoạt động'}
                                    color={record.status === 'active' ? 'success' : record.status === 'banned' ? 'error' : 'default'}
                                    size="small"
                                />
                            )}
                        /> */}

                        <DateField source="createdAt" label="Ngày tạo" sortable={true} />

                        <FunctionField
                            label="Hành động"
                            cellClassName="sticky-actions"
                            headerClassName="sticky-actions"
                            render={(record: User) => (
                                <AdminRowActions
                                    record={record}
                                    resource="users"
                                />
                            )}
                        />
                    </DatagridConfigurable>
                </Box>
            </List>
        </Card>
    );
};
