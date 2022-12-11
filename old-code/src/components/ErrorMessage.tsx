interface ErrorMessageProps {
    fieldName: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ fieldName }) => (
  <p className="text-red-600">Project's {fieldName} is required</p>
);

export default ErrorMessage;
