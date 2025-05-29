import React from 'react';
import { List, Datagrid, TextField, NumberField, ListProps } from 'react-admin';

const ProductList: React.FC<ListProps> = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Tên sản phẩm" />
      <NumberField
        source="price"
        label="Giá"
        options={{ style: 'currency', currency: 'VND' }}
      />
      <NumberField source="stock" label="Tồn kho" />
    </Datagrid>
  </List>
);

export default ProductList;
