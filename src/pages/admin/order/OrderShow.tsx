import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
} from "react-admin";

export const OrderShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="Mã đơn hàng" />
      <TextField source="customerName" label="Khách hàng" />
      <NumberField
        source="total"
        label="Tổng tiền"
        options={{ style: "currency", currency: "VND" }}
      />
      <TextField source="status" label="Trạng thái" />
      <DateField source="createdAt" label="Ngày đặt" showTime />
    </SimpleShowLayout>
  </Show>
);
