import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  BooleanInput,
  Create,
  DateInput,
  minValue,
  NumberInput,
  RadioButtonGroupInput,
  required,
  SimpleForm,
  TextInput,
} from 'react-admin';

const validateVoucherDates = (values: any) => {
  const errors: any = {};
  if (!values.validFrom || !values.validUntil) {
    return errors;
  }
  const start = new Date(values.validFrom);
  const end = new Date(values.validUntil);

  if (end <= start) {
    errors.validUntil = 'Ngày kết thúc phải sau ngày bắt đầu';
  }
  return errors;
};

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

import CustomBreadcrumbs from '../../../components/Admin/Breadcrumbs';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';


export const VoucherCreate = (props: any) => (
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
    <Create {...props} sx={{ '& .RaCreate-card': { boxShadow: 'none' } }}>
      <SimpleForm validate={validateVoucherDates} sx={{ maxWidth: '900px', margin: '0 auto', pb: 5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>

          {/* Section 1: Loại & Mã */}
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'visible' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold', mb: 1.5 }}>
                    LOẠI ƯU ĐÃI
                  </Typography>
                  <RadioButtonGroupInput
                    source="type"
                    choices={[
                      { id: 'percentage', name: 'Giảm theo %' },
                      { id: 'fixed', name: 'Giảm số tiền' },
                    ]}
                    validate={required()}
                    sx={{
                      '& .MuiFormGroup-root': { flexDirection: 'row', gap: 2 },
                      '& .MuiFormControlLabel-root': {
                        margin: 0,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        padding: '8px 16px',
                        flex: 1,
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: '#bdbdbd',
                          backgroundColor: '#f5f5f5',
                        },
                        '&:has(input[value="percentage"]:checked)': {
                          backgroundColor: '#e3f2fd',
                          borderColor: '#1976d2',
                          color: '#1565c0',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                        },
                        '&:has(input[value="fixed"]:checked)': {
                          backgroundColor: '#fff3e0',
                          borderColor: '#ed6c02',
                          color: '#e65100',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(237, 108, 2, 0.2)',
                        },
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <TradingInputWrapper color="#1976d2" label="Mã Voucher (Code)">
                    <TextInput source="code" validate={required()} fullWidth label="" placeholder="VD: SUMMER2024" />
                  </TradingInputWrapper>
                </Box>
              </Box>
              <Box sx={{ mt: 3 }}>
                <TradingInputWrapper color="#0288d1" label="Tên chương trình">
                  <TextInput source="name" validate={required()} fullWidth label="" placeholder="VD: Khuyến mãi mùa hè" />
                </TradingInputWrapper>
              </Box>
            </CardContent>
          </Card>

          {/* Section 2: Giá trị & Điều kiện */}
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 3, color: '#333' }}>
                Giá trị & Điều kiện áp dụng
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1 }}>
                  <TradingInputWrapper color="#2e7d32" label="Mức giảm">
                    <NumberInput source="value" min={0} validate={[required(), minValue(0)]} fullWidth label="" />
                  </TradingInputWrapper>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TradingInputWrapper color="#d32f2f" label="Đơn hàng tối thiểu">
                    <NumberInput source="minOrderAmount" min={0} validate={[required(), minValue(0)]} fullWidth label="" />
                  </TradingInputWrapper>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Section 3: Thời gian */}
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 3, color: '#333' }}>
                Thời gian hiệu lực
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1 }}>
                  <TradingInputWrapper color="#ed6c02" label="Ngày bắt đầu">
                    <DateInput source="validFrom" validate={required()} fullWidth label="" />
                  </TradingInputWrapper>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TradingInputWrapper color="#9c27b0" label="Ngày kết thúc">
                    <DateInput source="validUntil" validate={required()} fullWidth label="" />
                  </TradingInputWrapper>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Section 4: Cấu hình khác */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 2 }}>
              <TradingInputWrapper color="#607d8b" label="Giới hạn sử dụng">
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <NumberInput source="maxUses" defaultValue={100} min={0} validate={[minValue(0)]} label="Tổng lượt dùng" sx={{ flex: 1 }} />
                  <NumberInput source="maxUsesPerUser" defaultValue={1} min={0} validate={[minValue(0)]} label="Lượt dùng/Khách" sx={{ flex: 1 }} />
                </Box>
              </TradingInputWrapper>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }}>
              <Card elevation={0} sx={{ border: '1px dashed #bdbdbd', borderRadius: 2, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                <BooleanInput source="isActive" defaultValue={true} label="Kích hoạt ngay" sx={{ '& .MuiFormControlLabel-label': { fontWeight: 'bold', color: '#2e7d32' } }} />
              </Card>
            </Box>
          </Box>

          <TradingInputWrapper color="#757575" label="Ghi chú nội bộ">
            <TextInput source="description" fullWidth multiline rows={3} label="" placeholder="Ghi chú về chiến dịch này..." />
          </TradingInputWrapper>

        </Box>
      </SimpleForm>
    </Create>
  </Card>
);