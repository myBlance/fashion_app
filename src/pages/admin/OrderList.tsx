
import { List, Datagrid, TextField, DateField, NumberField, ListProps } from 'react-admin';

export const OrderList = (props: ListProps) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="customer_name" />
      <DateField source="order_date" />
      <NumberField source="total" />
    </Datagrid>
  </List>
);
