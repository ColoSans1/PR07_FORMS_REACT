import React from 'react';
import DynamicForm from '../components/DynamicForm';
import { useTranslation } from 'react-i18next';

interface PersonalFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

const PersonalForm: React.FC<PersonalFormProps> = ({ onSubmit }) => {
  const { i18n } = useTranslation();

  return (
    <div className="page-container">
      <div className="language-buttons">
        <button onClick={() => i18n.changeLanguage("es")}>🇪🇸 Español</button>
        <button onClick={() => i18n.changeLanguage("en")}>🇬🇧 English</button>
      </div>
      <DynamicForm formType="personal" onSubmit={onSubmit} />
    </div>
  );
};

export default PersonalForm;