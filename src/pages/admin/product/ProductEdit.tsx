import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  EditProps,
  BooleanInput,
  DateInput,
  ArrayInput,
  SimpleFormIterator,
} from 'react-admin';


const ProductEdit: React.FC<EditProps> = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" />
      <TextInput source="brand" />
      <TextInput source="category" />
      <TextInput source="type" />
      <TextInput source="style" />
      <TextInput source="delivery" />
      <TextInput source="thumbnail" />
      <TextInput source="price" />
      <TextInput source="originalPrice" />
      <BooleanInput source="status" />
      <BooleanInput source="sale" />
      <TextInput source="sold" />
      <TextInput source="total" />
      <DateInput source="createdAt" />

      {/* Mảng colors */}
      <ArrayInput source="colors">
        <SimpleFormIterator>

        </SimpleFormIterator>
      </ArrayInput>

      {/* Mảng sizes */}
      <ArrayInput source="sizes">
        <SimpleFormIterator>
          <TextInput source=''/>
        </SimpleFormIterator>
      </ArrayInput>

      {/* Mảng images */}
      <ArrayInput source="images">
        <SimpleFormIterator>
          <TextInput source=''/>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export default ProductEdit;
