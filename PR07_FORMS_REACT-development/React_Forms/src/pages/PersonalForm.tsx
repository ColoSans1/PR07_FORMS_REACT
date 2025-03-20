import React from 'react';
import DynamicForm from '../components/DynamicForm';

/* 
 * Props del componente PersonalForm.
 * onSubmit: Callback que recibe un objeto con los datos del formulario.
 */
interface PersonalFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* 
 * Componente que renderiza el formulario personal usando DynamicForm.
 * Incluye botones para cambiar el idioma.
 */
const PersonalForm: React.FC<PersonalFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      {/* Botones para cambiar el idioma de la aplicación. */}
      <DynamicForm formType="personal" onSubmit={onSubmit} />
    </div>
  );
};

export default PersonalForm;
