import React from 'react';
import FormPersonal from '../components/FormPersonal';
import { useTranslation } from 'react-i18next';

interface PersonalFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* Componente PersonalForm que renderiza el formulario de información personal */
const PersonalForm: React.FC<PersonalFormProps> = ({ onSubmit }) => {
  const { i18n } = useTranslation();

  return (
    <div className="page-container">
      {/* Botones para cambiar el idioma */}
      <div className="language-buttons">
        <button onClick={() => i18n.changeLanguage("es")}>🇪🇸 Español</button>
        <button onClick={() => i18n.changeLanguage("en")}>🇬🇧 English</button>
      </div>
      
      <FormPersonal onSubmit={onSubmit} />
    </div>
  );
};

export default PersonalForm;
