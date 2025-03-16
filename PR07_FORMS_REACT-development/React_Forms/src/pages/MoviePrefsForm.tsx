import React from 'react';
import DynamicForm from '../components/DynamicForm';

/* 
 * Interfaz que define las propiedades del componente MoviePrefsForm.
 * - onSubmit: Callback ejecutado al enviar el formulario con los datos ingresados (function).
 *   Recibe un objeto con claves basadas en los IDs de los campos y valores (string, number, o string[]).
 */
interface MoviePrefsFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* 
 * Componente React que renderiza el formulario de preferencias de cine utilizando DynamicForm.
 * Este componente actúa como un contenedor específico para el formulario de preferencias de películas,
 * delegando la lógica de renderizado y validación a DynamicForm.
 * @param {MoviePrefsFormProps} props - Propiedades del componente.
 * @returns {JSX.Element} - Elemento JSX con el formulario de preferencias de cine renderizado.
 */
const MoviePrefsForm: React.FC<MoviePrefsFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      {/* 
       * Renderiza el componente DynamicForm con el tipo 'movie'.
       * - formType: Especifica que se renderice el formulario de preferencias de cine.
       * - onSubmit: Pasa el callback onSubmit al componente hijo para manejar los datos enviados.
       */}
      <DynamicForm formType="movie" onSubmit={onSubmit} />
    </div>
  );
};

export default MoviePrefsForm;