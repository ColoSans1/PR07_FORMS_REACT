import React from 'react';
import DynamicForm from '../components/DynamicForm';

/* 
 * Propiedades del componente AcademicForm.
 * onSubmit: Función que maneja los datos del formulario.
 */
interface AcademicFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* 
 * Componente que renderiza el formulario académico usando DynamicForm.
 * Pasa el tipo 'academic' y el callback onSubmit a DynamicForm.
 */
const AcademicForm: React.FC<AcademicFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <DynamicForm formType="academic" onSubmit={onSubmit} />
    </div>
  );
};

export default AcademicForm;
