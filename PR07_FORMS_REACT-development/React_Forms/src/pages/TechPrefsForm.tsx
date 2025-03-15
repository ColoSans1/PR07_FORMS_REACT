import React from 'react';
import DynamicForm from '../components/DynamicForm';

interface TechPrefsFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

const TechPrefsForm: React.FC<TechPrefsFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <DynamicForm formType="tech" onSubmit={onSubmit} />
    </div>
  );
};

export default TechPrefsForm;