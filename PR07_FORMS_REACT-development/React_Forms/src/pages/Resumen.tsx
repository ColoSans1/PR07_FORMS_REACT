import React from 'react';

/* 
 * Interfaz que define la estructura de los datos de los formularios completados.
 * - personal: (opcional) Datos del formulario personal (objeto con claves y valores de tipo string, number o string[]).
 * - academic: (opcional) Datos del formulario académico (objeto con claves y valores de tipo string, number o string[]).
 * - tech: (opcional) Datos del formulario de preferencias tecnológicas (objeto con claves y valores de tipo string, number o string[]).
 * - movie: (opcional) Datos del formulario de preferencias de cine (objeto con claves y valores de tipo string, number o string[]).
 */
interface FormData {
  personal?: { [key: string]: string | number | string[] };
  academic?: { [key: string]: string | number | string[] };
  tech?: { [key: string]: string | number | string[] };
  movie?: { [key: string]: string | number | string[] };
}

/* 
 * Interfaz que define las propiedades del componente Resumen.
 * - formData: Objeto que contiene los datos de los formularios completados (FormData).
 * - onBack: Callback ejecutado al hacer clic en el botón "Volver a Bienvenida" (function).
 * - onReset: Callback ejecutado al hacer clic en el botón "Reset" (function).
 */
interface ResumenProps {
  formData: FormData;
  onBack: () => void;
  onReset: () => void;
}

/* 
 * Componente React que muestra un resumen de las respuestas de todos los formularios completados.
 * Renderiza los datos en secciones con listas y proporciona botones para volver atrás o reiniciar el flujo.
 * @param {ResumenProps} props - Propiedades del componente.
 * @returns {JSX.Element} - Elemento JSX con el resumen de las respuestas.
 */
const Resumen: React.FC<ResumenProps> = ({ formData, onBack, onReset }) => {
  return (
    <div className="page-container">
      {/* 
       * Título principal del componente.
       * Muestra "Resumen de Tus Respuestas" como encabezado.
       */}
      <h1>Resumen de Tus Respuestas</h1>
      {/* 
       * Itera sobre cada formulario en formData para mostrar sus datos.
       * Cada formulario se renderiza como una sección con su nombre y una lista de campos.
       */}
      {Object.entries(formData).map(([formId, data]) => (
        <div key={formId} className="summary-section">
          {/* 
           * Título de la sección, capitalizando la primera letra del ID del formulario.
           * Por ejemplo, 'personal' se muestra como 'Personal'.
           */}
          <h2>{formId.charAt(0).toUpperCase() + formId.slice(1)}</h2>
          <ul>
            {/* 
             * Itera sobre los campos del formulario para mostrar cada par clave-valor.
             * Maneja el caso en que data sea undefined con un valor por defecto ({}).
             */}
            {Object.entries(data || {}).map(([field, value]) => (
              <li key={field}>
                {/* 
                 * Muestra la clave del campo, capitalizando y reemplazando guiones bajos por espacios.
                 * Por ejemplo, 'favorite_movie' se muestra como 'Favorite Movie'.
                 */}
                <strong>{field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}:</strong> 
                {/* 
                 * Muestra el valor del campo, serializado como JSON para manejar diferentes tipos de datos.
                 */}
                {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {/* 
       * Botón para volver a la página de bienvenida, estilizado con la clase back-button.
       * Ejecuta el callback onBack al hacer clic.
       */}
      <button className="back-button" onClick={onBack}>
        Volver a Bienvenida
      </button>
      {/* 
       * Botón para reiniciar el flujo de formularios, estilizado con la clase back-button.
       * Ejecuta el callback onReset al hacer clic.
       */}
      <button className="back-button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
};

export default Resumen;