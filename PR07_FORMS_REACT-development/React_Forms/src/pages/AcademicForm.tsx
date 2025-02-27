/* Página para el formulario de información personal, usando el componente reutilizable */
import React from 'react';
import FormPersonal from '../components/FormPersonal';

interface PersonalFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* Componente PersonalForm que renderiza el formulario de información personal */
const PersonalForm: React.FC<PersonalFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      <FormPersonal onSubmit={onSubmit} />
    </div>
  );
};

export default PersonalForm;