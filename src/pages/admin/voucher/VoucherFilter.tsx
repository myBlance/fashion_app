import { InputAdornment } from '@mui/material';
import { TextInput, SelectInput, DateInput, SearchInput } from 'react-admin';
import SearchIcon from '@mui/icons-material/Search';

// Các lựa chọn cho trường "type"
const typeChoices = [
  { id: 'percentage', name: 'Phần trăm (%)' },
  { id: 'fixed', name: 'Cố định (VNĐ)' },
];

// Các lựa chọn cho trường "isActive"
const statusChoices = [
  { id: 'true', name: 'Hoạt động' },
  { id: 'false', name: 'Ngừng hoạt động' },
];

export const voucherFilter = [
  // Tìm kiếm toàn cục
  <SearchInput
    source="q"
    alwaysOn
    key="search"
    placeholder="Tìm kiếm voucher..."
    variant="outlined"
    sx={{ ml: 2 }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <SearchIcon color="action" />
        </InputAdornment>
      ),
    }}
  />,

  // Mã voucher
  <TextInput
    source="code"
    label="Mã voucher"
    key="code"
    variant="outlined"
    sx={{ ml: 2 }}
    resettable
  />,

  // Tên voucher
  <TextInput
    source="name"
    label="Tên voucher"
    key="name"
    variant="outlined"
    sx={{ ml: 2 }}
    resettable
  />,

  // Loại giảm
  <SelectInput
    source="type"
    label="Loại giảm"
    choices={typeChoices}
    key="type"
    variant="outlined"
    sx={{ ml: 2 }}
    resettable
  />,

  // Trạng thái
  <SelectInput
    source="isActive"
    label="Trạng thái"
    choices={statusChoices}
    key="status"
    variant="outlined"
    sx={{ ml: 2 }}
    resettable
  />,

  // Ngày bắt đầu (từ)
  <DateInput
    source="validFrom_gte"
    label="Từ ngày"
    key="validFrom_gte"
    variant="outlined"
    sx={{ ml: 2 }}

  />,

  // Ngày kết thúc (đến)
  <DateInput
    source="validUntil_lte"
    label="Đến ngày"
    key="validUntil_lte"
    variant="outlined"
    sx={{ ml: 2 }}

  />,
];