import React from 'react';

/* 
 * Estructura de los datos de los formularios completados.
 * Cada formulario tiene datos opcionales de tipo string, number o string[].
 */
interface FormData {
  personal?: { [key: string]: string | number | string[] };
  academic?: { [key: string]: string | number | string[] };
  tech?: { [key: string]: string | number | string[] };
  movie?: { [key: string]: string | number | string[] };
}

/* 
 * Propiedades del componente Resumen.
 * formData: Datos de los formularios completados.
 * onBack: Callback al hacer clic en el botón "Volver a Bienvenida".
 * onReset: Callback al hacer clic en el botón "Reset".
 */
interface ResumenProps {
  formData: FormData;
  onBack: () => void;
  onReset: () => void;
}

/* 
 * Componente que muestra un resumen de las respuestas de los formularios completados.
 * Proporciona botones para volver a la bienvenida o reiniciar el flujo.
 */
const Resumen: React.FC<ResumenProps> = ({ formData, onBack, onReset }) => {
  return (
    <div className="page-container">
      <h1>Resumen de Tus Respuestas</h1>
      
      {Object.entries(formData).map(([formId, data]) => (
        <div key={formId} className="summary-section">
          <h2>{formId.charAt(0).toUpperCase() + formId.slice(1)}</h2>
          <ul>
            {Object.entries(data || {}).map(([field, value]) => (
              <li key={field}>
                <strong>{field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}:</strong> 
                {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button className="back-button" onClick={onBack}>Volver a Bienvenida</button>
      <button className="back-button" onClick={onReset}>Reset</button>
    </div>
  );
};

export default Resumen;
