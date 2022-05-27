import { Field as FinalFormField } from 'react-final-form';

interface FieldProps {
  name: string;
  component: JSX.Element;
}

const Field: React.FC<FieldProps> = ({ name, component }) => (
  <FinalFormField name={name}>
    {({ input, meta }) => (
      <div>
        {component}
        {meta.error && meta.touched && <span className="text-red-600">{meta.error}</span>}
      </div>
    )}
  </FinalFormField>
);

export default Field;
