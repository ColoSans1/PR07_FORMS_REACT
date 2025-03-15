import React from 'react';
import DynamicForm from '../components/DynamicForm';

interface MoviePrefsFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

const MoviePrefsForm: React.FC<MoviePrefsFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <DynamicForm formType="movie" onSubmit={onSubmit} />
    </div>
  );
};

export default MoviePrefsForm;