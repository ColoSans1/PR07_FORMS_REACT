import React from 'react';
import DynamicForm from '../components/DynamicForm';

interface AcademicFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

const AcademicForm: React.FC<AcademicFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <DynamicForm formType="academic" onSubmit={onSubmit} />
    </div>
  );
};

export default AcademicForm;