// OrderList.tsx
import {
  List,
  TextField,
  DateField,
  NumberField,
  FunctionField,
  useRecordContext,
  useListContext,
  DatagridConfigurable,
} from "react-admin";
import { orderFilters } from "./OrderFilter";
import { Box, Card, Chip } from "@mui/material";
import CustomBreadcrumbs from "../../../components/Admin/Breadcrumbs";
import { CustomAppBar } from "../../../components/Admin/CustomAppBar";


const STTField = () => {
      const { isLoading, page = 1, perPage = 10, data = [] } = useListContext();
      const record = useRecordContext();
      
      if (isLoading || !record) return <span>-</span>;
  
      const index = data.findIndex((item: any) => item.id === record.id);
      
      return (page - 1) * perPage + (index >= 0 ? index : 0) + 1;
  };

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
                perPage={10}
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
                    <FunctionField
                        label="STT"
                        render={() => <STTField />}
                        sx={{ 
                            textAlign: 'center',
                            width: 60,
                            '& .RaFunctionField-field': {
                                display: 'flex',
                                justifyContent: 'center',
                            }
                        }}
                    />
                    <TextField source="id" label="Mã đơn hàng" />
                    <TextField source="customerName" label="Khách hàng" />
                    <NumberField
                        source="total"
                        label="Tổng tiền"
                        options={{ style: "currency", currency: "VND" }}
                    />
                    <StatusChip />
                    <DateField source="createdAt" label="Ngày đặt" showTime />
                </DatagridConfigurable>
            </List>
        </Card>
    );
};
