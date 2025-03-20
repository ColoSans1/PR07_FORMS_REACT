// Traemos React para usar el componente
import React from 'react';
import DynamicForm from '../components/DynamicForm';

// Esto dice qué necesita el componente MoviePrefsForm
// onSubmit: Función que se ejecuta al enviar el formulario con los datos ingresados
interface MoviePrefsFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

// Componente MoviePrefsForm: Formulario de preferencias de cine
const MoviePrefsForm: React.FC<MoviePrefsFormProps> = ({ onSubmit }) => {
  return (
    // Contenedor principal del formulario
    <div className="page-container">
      {/* Renderiza el formulario dinámico con el tipo 'movie' */}
      <DynamicForm formType="movie" onSubmit={onSubmit} />
    </div>
  );
};

// Exportamos el componente
export default MoviePrefsForm;
