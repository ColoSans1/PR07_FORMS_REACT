/* Página para el formulario de preferencias en tecnología, usando el componente reutilizable */
import React from 'react';
import FormTechPrefs from '../components/FormTechPrefs';

interface TechPrefsFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* Componente TechPrefsForm que renderiza el formulario de tecnología */
const TechPrefsForm: React.FC<TechPrefsFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <FormTechPrefs onSubmit={onSubmit} />
    </div>
  );
};

export default TechPrefsForm;