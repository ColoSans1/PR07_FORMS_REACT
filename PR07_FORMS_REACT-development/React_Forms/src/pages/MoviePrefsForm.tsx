/* Página para el formulario de preferencias en cine, usando el componente reutilizable */
import React from 'react';
import FormMoviePrefs from '../components/FormMoviePrefs';

interface MoviePrefsFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* Componente MoviePrefsForm que renderiza el formulario de cine */
const MoviePrefsForm: React.FC<MoviePrefsFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <FormMoviePrefs onSubmit={onSubmit} />
    </div>
  );
};

export default MoviePrefsForm;