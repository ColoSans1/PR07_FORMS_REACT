import React from 'react';
import DynamicForm from '../components/DynamicForm';

/* 
 * Props del componente TechPrefsForm.
 * onSubmit: Callback que recibe los datos del formulario.
 */
interface TechPrefsFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* 
 * Componente que renderiza el formulario de preferencias tecnológicas usando DynamicForm.
 */
const TechPrefsForm: React.FC<TechPrefsFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <DynamicForm formType="tech" onSubmit={onSubmit} />
    </div>
  );
};

export default TechPrefsForm;
