import {
  List,
  TextField,
  DateField,
  NumberField,
  useRecordContext,
  DatagridConfigurable,
  useNotify,
  useRefresh,
} from "react-admin";
import { useDataProvider } from "react-admin";
import { orderFilters } from "./OrderFilter";
import { Box, Card, Chip, Tooltip } from "@mui/material";
import CustomBreadcrumbs from "../../../components/Admin/Breadcrumbs";
import { CustomAppBar } from "../../../components/Admin/CustomAppBar";
import { Edit, Visibility } from '@mui/icons-material';
import { FunctionField } from 'react-admin';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';


const StatusChip = () => {
    const record = useRecordContext();
    const status = record?.status;
    const labelMap: Record<string, string> = {
        pending: "Chờ xác nhận",
        shipping: "Đang giao",
        completed: "Đã hoàn thành",
        cancelled: "Đã hủy",
    };
    const colorMap: Record<string, "default" | "primary" | "success" | "error" | "warning" | "info"> = {
        pending: "warning",
        shipping: "info",
        completed: "success",
        cancelled: "error",
    };

    return (
        <Chip
            label={labelMap[status] || "Không xác định"}
            color={colorMap[status] || "default"}
            size="small"
        />
    );
};

export const OrderList = () => {
    const navigate = useNavigate();
    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    return (
        <Card sx={{ 
                borderRadius: "20px", 
                mr: "-24px", 
                height: "100%",
                boxShadow: 'none',
                overflow: 'visible'
            }}
        >
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs />
            </Box>
            <List
                filters={orderFilters}
                exporter={false}
                
                sx={{
                    border: "2px solid #ddd",
                    borderRadius: "20px",
                    // mt: "-10px",
                    mx: "20px",
                    mb: "20px",
                    pt: "10px",
                    '& .RaList-actions':{
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
                            backgroundColor:
                                theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e',
                            fontWeight: 'bold',
                            py: 2,
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                        },
                        '& .RaDatagrid-rowCell': {
                            py: 2,
                        },
                        '& .RaDatagrid-tableRow': {
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        },
                    })}
                    rowClick="show"
                >
                    <TextField source="id" label="Mã đơn hàng" />
                    <TextField source="customerName" label="Khách hàng" />
                    <NumberField
                        source="total"
                        label="Tổng tiền"
                        options={{ style: "currency", currency: "VND" }}
                    />
                    <FunctionField
                        label="Trạng thái"
                        render={() => <StatusChip />}
                    />

                    <DateField 
                        source="createdAt" 
                        label="Ngày tạo" 
                        sx={{ whiteSpace: 'nowrap' }} 
                    />
                    <FunctionField
                        label="Hành động"
                        render={(record: any) => (
                            <Box sx={{ display: 'flex', gap: 0.1}}>
                                <Tooltip title="Xem">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate(`/admin/products/show?clone=${record.id}`)}
                                    >
                                        <Visibility fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                              
                                <Tooltip title="Sửa">
                                    <IconButton
                                        size="small"
                                        color="info"
                                        onClick={() => navigate(`/admin/products/${record.id}`)}
                                    >
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                {/* Xoá */}
                                    <Tooltip title="Xoá">
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => {
                                                if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
                                                    dataProvider.delete('products', { id: record.id })
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
            </List>
        </Card>
    );
};
