/* Página para el formulario de evaluación académica, usando el componente reutilizable */
import React from 'react';
import FormAcademic from '../components/FormAcademic';

interface AcademicFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* Componente AcademicForm que renderiza el formulario académico */
const AcademicForm: React.FC<AcademicFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <FormAcademic onSubmit={onSubmit} />
    </div>
  );
};

export default AcademicForm;