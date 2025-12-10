import {
  BooleanInput,
  Create,
  DateInput,
  NumberInput,
  required,
  SelectInput,
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

export const VoucherCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm validate={validateVoucherDates}>
      <TextInput source="code" validate={required()} />
      <TextInput source="name" validate={required()} />
      <TextInput source="description" />
      <SelectInput
        source="type"
        choices={[
          { id: 'percentage', name: 'Phần trăm' },
          { id: 'fixed', name: 'Cố định' },
        ]}
        validate={required()}
      />
      <NumberInput source="value" validate={required()} />
      <NumberInput source="minOrderAmount" validate={required()} />
      <DateInput source="validFrom" validate={required()} />
      <DateInput source="validUntil" validate={required()} />
      <NumberInput source="maxUses" defaultValue={1} />
      <NumberInput source="maxUsesPerUser" defaultValue={1} />
      <BooleanInput source="isActive" defaultValue={true} />
    </SimpleForm>
  </Create>
);