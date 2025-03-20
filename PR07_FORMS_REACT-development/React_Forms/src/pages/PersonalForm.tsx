import React from 'react';
import DynamicForm from '../components/DynamicForm';
import { useTranslation } from 'react-i18next';

/* 
 * Interfaz que define las propiedades del componente PersonalForm.
 * - onSubmit: Callback ejecutado al enviar el formulario con los datos ingresados (function).
 *   Recibe un objeto con claves basadas en los IDs de los campos y valores (string, number, o string[]).
 */
interface PersonalFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* 
 * Componente React que renderiza el formulario personal utilizando DynamicForm.
 * Incluye botones para cambiar el idioma de la aplicación mediante react-i18next.
 * Este componente actúa como un contenedor específico para el formulario personal,
 * delegando la lógica de renderizado y validación a DynamicForm.
 * @param {PersonalFormProps} props - Propiedades del componente.
 * @returns {JSX.Element} - Elemento JSX con el formulario personal y los botones de idioma.
 */
const PersonalForm: React.FC<PersonalFormProps> = ({ onSubmit }) => {
  const { i18n } = useTranslation(); /* Hook para acceder a las funciones de cambio de idioma de react-i18next. */

  return (
    <div className="page-container">
      {/* 
       * Contenedor de botones para cambiar el idioma de la aplicación.
       * Utiliza la clase language-buttons para estilizar los botones.
       */}

      {/* 
       * Renderiza el componente DynamicForm con el tipo 'personal'.
       * - formType: Especifica que se renderice el formulario personal.
       * - onSubmit: Pasa el callback onSubmit al componente hijo para manejar los datos enviados.
       */}
      <DynamicForm formType="personal" onSubmit={onSubmit} />
    </div>
  );
};

export default PersonalForm;