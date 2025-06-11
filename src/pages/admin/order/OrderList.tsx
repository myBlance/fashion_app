import {
  List,
  TextField,
  DateField,
  NumberField,
  useRecordContext,
  DatagridConfigurable,
} from "react-admin";
import { orderFilters } from "./OrderFilter";
import { Box, Card, Chip, Tooltip } from "@mui/material";
import CustomBreadcrumbs from "../../../components/Admin/Breadcrumbs";
import { CustomAppBar } from "../../../components/Admin/CustomAppBar";
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { DeleteButton, FunctionField } from 'react-admin';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';


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
                    sx={{
                        '& .RaDatagrid-headerCell': {
                            backgroundColor: '#f5f5f5',
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
                    }}
                    rowClick="show"
                >
                    <TextField source="id" label="Mã đơn hàng" />
                    <TextField source="customerName" label="Khách hàng" />
                    <NumberField
                        source="total"
                        label="Tổng tiền"
                        options={{ style: "currency", currency: "VND" }}
                    />
                    <StatusChip />
                    <DateField source="createdAt" label="Ngày đặt" showTime />
                    <FunctionField
                        label="Hành động"
                        render={(record: any) => (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Xem/Clone">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate(`/admin/products/show?clone=${record.id}`)}
                                    >
                                        <Visibility fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                {/* Sửa */}
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
                                    <DeleteButton
                                        size="small"
                                        record={record}
                                        mutationMode="pessimistic"
                                        confirmTitle="Xác nhận xoá"
                                        confirmContent="Bạn có chắc muốn xoá sản phẩm này?"
                                        icon={<Delete fontSize="small"/>}
                                        label=""
                                    />
                                </Tooltip>
                            </Box>
                        )}
                    />

                </DatagridConfigurable>
            </List>
        </Card>
    );
};
