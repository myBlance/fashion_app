import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  SelectInput,
  BooleanInput,
  required,
} from 'react-admin';

export const VoucherCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
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