import React from 'react';
import '../assets/Resumen.css';

/* 
 * Estructura de los datos de los formularios completados.
 * Cada formulario contiene un objeto con claves y valores de tipo string, number o string[].
 */
interface FormData {
  personal?: { [key: string]: string | number | string[] };
  academic?: { [key: string]: string | number | string[] };
  tech?: { [key: string]: string | number | string[] };
  movie?: { [key: string]: string | number | string[] };
}

/* 
 * Props del componente Resumen.
 * formData: Datos de los formularios completados.
 * onBack: Callback para volver a la pantalla de bienvenida.
 * onReset: Callback para reiniciar el flujo de formularios.
 */
interface ResumenProps {
  formData: FormData;
  onBack: () => void;
  onReset: () => void;
}

/* 
 * Componente que muestra un resumen de las respuestas de los formularios.
 * Incluye botones para volver atrás o reiniciar el flujo.
 */
const Resumen: React.FC<ResumenProps> = ({ formData, onBack, onReset }) => {
  return (
    <div className="resumen-container">
      <h1 className="title">Resumen de Tus Respuestas</h1>
      {Object.entries(formData).map(([formId, data]) => (
        <div key={formId} className="summary-section">
          <h2 className="form-title">{formId.charAt(0).toUpperCase() + formId.slice(1)}</h2>
          <ul className="form-details">
            {Object.entries(data || {}).map(([field, value]) => (
              <li key={field} className="form-item">
                <strong className="field-name">
                  {field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}:
                </strong>
                <span className="field-value">{JSON.stringify(value)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="buttons-container">
        <button className="button back-button" onClick={onBack}>Volver a Bienvenida</button>
        <button className="button reset-button" onClick={onReset}>Reiniciar</button>
      </div>
    </div>
  );
};

export default Resumen;
