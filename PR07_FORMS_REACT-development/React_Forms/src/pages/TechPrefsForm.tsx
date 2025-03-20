import React from 'react';
import DynamicForm from '../components/DynamicForm';

/* 
 * Propiedades del componente TechPrefsForm.
 * onSubmit: Callback al enviar el formulario con los datos ingresados.
 */
interface TechPrefsFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* 
 * Componente que renderiza el formulario de preferencias tecnológicas.
 * Utiliza DynamicForm para la lógica de renderizado y validación.
 */
const TechPrefsForm: React.FC<TechPrefsFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      {/* 
       * Renderiza el formulario de preferencias tecnológicas.
       * Pasa el callback onSubmit para manejar los datos.
       */}
      <DynamicForm formType="tech" onSubmit={onSubmit} />
    </div>
  );
};

export default TechPrefsForm;
