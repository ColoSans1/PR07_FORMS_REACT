import React from 'react';
import DynamicForm from '../components/DynamicForm';

/* 
 * Propiedades del componente MoviePrefsForm.
 * onSubmit: Función ejecutada al enviar el formulario con los datos.
 */
interface MoviePrefsFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* 
 * Componente para renderizar el formulario de preferencias de cine.
 * Delegamos la lógica de renderizado y validación al componente DynamicForm.
 */
const MoviePrefsForm: React.FC<MoviePrefsFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <DynamicForm formType="movie" onSubmit={onSubmit} />
    </div>
  );
};

export default MoviePrefsForm;
