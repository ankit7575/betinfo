import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorAlert = ({ error }) => {
  if (!error) return null;
  return (
    <Alert variant="danger" className="text-center">
      {error}
    </Alert>
  );
};

export default ErrorAlert;
