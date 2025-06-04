import { 
    Avatar, 
    Box, 
    Card, 
    Chip 
} from '@mui/material';
import {
    BooleanField,
    DatagridConfigurable,
    DateField,
    FilterButton,
    FunctionField,
    List,
    NumberField,
    Pagination,
    TextField,
    TopToolbar,
    useListContext,
    useRecordContext,
} from 'react-admin';
import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import { productFilters } from './ProductFilter';
import { useNavigate } from 'react-router-dom';


// 1. STT Field với pagination support
const STTField = () => {
    const { isLoading, page = 1, perPage = 10, data = [] } = useListContext();
    const record = useRecordContext();
    
    if (isLoading || !record) return <span>-</span>;

    const index = data.findIndex((item: any) => item.id === record.id);
    
    return (page - 1) * perPage + (index >= 0 ? index : 0) + 1;
};

// 2. Custom Field Components
const ThumbnailField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    return record ? (
        <Avatar
            variant="rounded"
            src={record[source]}
            alt={record?.name}
            sx={{ width: 48, height: 48 }}
        />
    ) : null;
};

const ColorField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    return record?.[source] ? (
        <Box display="flex" gap={1}>
            {record[source].map((color: string, index: number) => (
                <Box
                    key={index}
                    sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: '1px solid #ddd',
                    }}
                />
            ))}
        </Box>
    ) : null;
};

const SizeField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    return record?.[source] ? (
        <Box display="flex" gap={0.5} flexWrap="wrap" maxWidth={150}>
            {record[source].map((size: string, index: number) => (
                <Chip key={index} label={size} size="small" />
            ))}
        </Box>
    ) : null;
};

// 3. Custom Actions Toolbar
// const ListActions = () => (
//     <TopToolbar sx={{ justifyContent: 'left', width: '100%' }}>
//         <FilterButton filters={productFilters} />
//         <Stack direction="row" spacing={2}>
//             <CreateButton />
//             <ExportButton />
//         </Stack>
//     </TopToolbar>
// );

const ListActions = () => (
    <TopToolbar>
        <FilterButton />
        {/* Nếu muốn thêm các nút khác như export, refresh, thêm ở đây */}
    </TopToolbar>
);


// 4. Main Component
export const ProductList = () => {
    const navigate = useNavigate();
    


    const handleCreate = () => {
        navigate('/admin/products/create');
    };

    const handleExport = () => {
        console.log('Export clicked');  
    };
    
    return (
        <Card sx={{ 
            borderRadius: "20px", 
            mr: "-24px", 
            height: "100%",
            boxShadow: 'none',
            overflow: 'visible'
        }}>
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />
                <CustomBreadcrumbs 
                    onCreate={handleCreate}
                    onExport={handleExport}
                 />
            </Box>
            
            <List
                filters={productFilters}
                exporter={false}
                pagination={<Pagination />}
                actions={<ListActions />}
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
                        rowClick="edit"
                        omit={['sale', 'createdAt']}
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
                        preferenceKey="product-datagrid-config-v2"
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
                        <TextField source="id" label="Mã SP" />
                        <ThumbnailField source="thumbnail" />
                        <TextField source="name" label="Tên sản phẩm" />
                        <TextField source="brand" label="Thương hiệu" />
                        <TextField source="category" label="Danh mục" />
                        <ColorField source="colors"/>
                        <SizeField source="sizes" />
                        <NumberField 
                            source="price" 
                            label="Giá bán"
                            options={{ style: 'currency', currency: 'VND' }}
                            sx={{ fontWeight: 'bold' }}
                        />
                        <NumberField 
                            source="originalPrice" 
                            label="Giá gốc"
                            options={{ style: 'currency', currency: 'VND' }}
                        />
                        <FunctionField 
                            label="Giảm giá"
                            render={(record: any) =>
                                `${Math.round((1 - record.price / record.originalPrice) * 100)}%`
                            }
                            sx={{ color: 'red', fontWeight: 'bold' }}
                        />
                        <NumberField source="sold" label="Đã bán" />
                        <NumberField source="total" label="Tồn kho" />
                        <BooleanField 
                            source="status" 
                            label="Trạng thái"
                            sx={{
                                '& .RaBooleanField-falseIcon': { color: 'error.main' },
                                '& .RaBooleanField-trueIcon': { color: 'success.main' },
                            }}
                        />
                        <DateField 
                            source="createdAt" 
                            label="Ngày tạo" 
                            showTime
                            sx={{ whiteSpace: 'nowrap' }}
                        />
                    </DatagridConfigurable>
                
            </List>
        </Card>
    );
};