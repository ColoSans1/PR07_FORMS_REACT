import React from 'react';
import DynamicForm from '../components/DynamicForm';

/* 
 * Interfaz que define las propiedades del componente AcademicForm.
 * - onSubmit: Callback ejecutado al enviar el formulario con los datos ingresados (function).
 *   Recibe un objeto con claves basadas en los IDs de los campos y valores (string, number, o string[]).
 */
interface AcademicFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

/* 
 * Componente React que renderiza el formulario académico utilizando DynamicForm.
 * Este componente actúa como un contenedor específico para el formulario de evaluación académica,
 * delegando la lógica de renderizado y validación a DynamicForm.
 * @param {AcademicFormProps} props - Propiedades del componente.
 * @returns {JSX.Element} - Elemento JSX con el formulario académico renderizado.
 */
const AcademicForm: React.FC<AcademicFormProps> = ({ onSubmit }) => {
  return (
    <div className="page-container">
      {/* 
       * Renderiza el componente DynamicForm con el tipo 'academic'.
       * - formType: Especifica que se renderice el formulario académico.
       * - onSubmit: Pasa el callback onSubmit al componente hijo para manejar los datos enviados.
       */}
      <DynamicForm formType="academic" onSubmit={onSubmit} />
    </div>
  );
};

export default AcademicForm;