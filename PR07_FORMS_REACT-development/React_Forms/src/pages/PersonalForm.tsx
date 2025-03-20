import React from 'react';
import DynamicForm from '../components/DynamicForm';
import { useTranslation } from 'react-i18next';

/* 
 * Propiedades del componente PersonalForm.
 * onSubmit: Función ejecutada al enviar el formulario con los datos.
 */
interface PersonalFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* 
 * Componente que renderiza el formulario personal y permite cambiar el idioma de la aplicación.
 * Delegamos el renderizado y validación a DynamicForm.
 */
const PersonalForm: React.FC<PersonalFormProps> = ({ onSubmit }) => {
  const { i18n } = useTranslation(); // Hook para cambiar el idioma.

  return (
    <div className="page-container">
      <div className="language-buttons">
        {/* Botones para cambiar el idioma */}
        <button onClick={() => i18n.changeLanguage("es")}>🇪🇸 Español</button>
        <button onClick={() => i18n.changeLanguage("en")}>🇬🇧 English</button>
      </div>
      <DynamicForm formType="personal" onSubmit={onSubmit} />
    </div>
  );
};

export default PersonalForm;
