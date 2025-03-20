// Traemos React para usar el componente
import React from 'react';

// Traemos DynamicForm, que es el componente que hace el formulario
import DynamicForm from '../components/DynamicForm';

// Esto dice qué recibe el componente AcademicForm
// onSubmit es una función que se usa cuando envías el formulario
interface AcademicFormProps {
  onSubmit: (data: { [key: string]: string | number | string[] }) => void;
}

// Este es el componente AcademicForm
// Muestra el formulario académico usando DynamicForm
const AcademicForm: React.FC<AcademicFormProps> = ({ onSubmit }) => {
  return (
    // Esto es un contenedor para el formulario
    <div className="page-container">
      {/* 
        Aquí usamos DynamicForm
        formType="academic" dice que es el formulario académico
        onSubmit pasa la función para enviar los datos
      */}
      <DynamicForm formType="academic" onSubmit={onSubmit} />
    </div>
  );
};

// Exportamos el componente para usarlo en otros archivos
export default AcademicForm;