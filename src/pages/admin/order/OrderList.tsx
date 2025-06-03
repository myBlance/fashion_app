import { Box, Card } from '@mui/material';
import {
    DatagridConfigurable,
    DateField,
    List,
    ListProps,
    NumberField,
    TextField
} from 'react-admin';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';

export const OrderList = (props: ListProps) => {
    return (
        <Card sx={{ borderRadius: "20px", mr: "-24px", height: "100%" }}>
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs/>
            </Box>
            <List
                {...props}
                actions={false}
                queryOptions={{ staleTime: 60000 }}
                sx={{
                    border: "2px solid #ddd",
                    borderRadius: "20px",
                    mt: "-10px",
                    ml: "20px",
                    mr: "20px",
                    mb: "20px",
                    pt: "10px",
                }}
            >
                <DatagridConfigurable
                    rowClick="edit"
                    bulkActionButtons={false}
                    sx={{
                        "& .RaDatagrid-headerCell": {
                            backgroundColor: "#b9b9b9",
                            fontWeight: "bold",
                        },
                        "& .RaDatagrid-rowEven": { backgroundColor: "#ffffff" },
                        "& .RaDatagrid-rowOdd": { backgroundColor: "#ffffff" },
                    }}
                >
                    <TextField source="id" />
                    <TextField source="customer" label="Customer Name" />
                    <DateField source="date" label="Order Date" />
                    <TextField source="status" label="Order Status" />
                    <NumberField source="total" label="Total Amount" />
                </DatagridConfigurable>
            </List>
        </Card>
    );
};
