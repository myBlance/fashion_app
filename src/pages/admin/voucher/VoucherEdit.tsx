import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  SelectInput,
  BooleanInput,
  required,
} from 'react-admin';

export const VoucherEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="code" label="Mã voucher" validate={required()} />
      <TextInput source="name" label="Tên voucher" validate={required()} />
      <TextInput source="description" label="Mô tả" />
      <SelectInput
        source="type"
        label="Loại giảm"
        choices={[
          { id: 'percentage', name: 'Phần trăm' },
          { id: 'fixed', name: 'Cố định' },
        ]}
        validate={required()}
      />
      <NumberInput source="value" label="Giá trị" validate={required()} />
      <NumberInput source="minOrderAmount" label="Giá trị tối thiểu đơn" validate={required()} />
      <DateInput source="validFrom" label="Bắt đầu" validate={required()} />
      <DateInput source="validUntil" label="Kết thúc" validate={required()} />
      <NumberInput source="maxUses" label="Số lần tối đa" defaultValue={1} />
      <NumberInput source="maxUsesPerUser" label="Số lần tối đa mỗi người" defaultValue={1} />
      <BooleanInput source="isActive" label="Hoạt động" defaultValue={true} />
    </SimpleForm>
  </Edit>
);
