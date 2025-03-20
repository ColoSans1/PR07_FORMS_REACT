import React from "react";
import "../assets/AllForms.css"; // Asegúrate de crear este archivo CSS

/* 
 * Interfaz que define las propiedades del componente AllForms.
 * - formData: Objeto que contiene los datos de los formularios completados, con claves como 'personal', 'academic', etc.,
 *   y valores que representan los datos ingresados (any).
 * - onBack: Callback ejecutado al hacer clic en el botón "Volver" (function).
 */
interface AllFormsProps {
  formData: { [key: string]: any };
  onBack: () => void;
}

/* 
 * Componente React que muestra un resumen de todos los formularios completados.
 * Renderiza los datos en tarjetas con tablas y un botón para volver atrás.
 * Si no hay datos, muestra un mensaje de "sin formularios completados".
 * @param {AllFormsProps} props - Propiedades del componente.
 * @returns {JSX.Element} - Elemento JSX con el resumen de formularios.
 */
const AllForms: React.FC<AllFormsProps> = ({ formData, onBack }) => {
  return (
    <div className="all-forms-container">
      {/* 
       * Título principal del componente, estilizado con la clase all-forms-title.
       * Muestra "Formularios Completados" como encabezado.
       */}
      <h2 className="all-forms-title">Formularios Completados</h2>
      {Object.keys(formData).length === 0 ? (
        /* 
         * Mensaje mostrado cuando no hay formularios completados.
         * Utiliza la clase no-data-message para estilizar el contenedor.
         */
        <div className="no-data-message">
          <p>No hay formularios completados.</p>
        </div>
      ) : (
        /* 
         * Contenedor de cuadrícula que muestra las tarjetas de cada formulario completado.
         * Utiliza la clase forms-grid para un diseño responsivo.
         */
        <div className="forms-grid">
          {Object.entries(formData).map(([formName, data]) => (
            <div key={formName} className="form-card">
              {/* 
               * Título de cada tarjeta, capitalizando la primera letra del nombre del formulario.
               * Estilizado con la clase form-card-title.
               */}
              <h3 className="form-card-title">{formName.charAt(0).toUpperCase() + formName.slice(1)}</h3>
              <table className="data-table">
                <tbody>
                  {Object.entries(data).map(([key, value]) => (
                    <tr key={key} className="data-row">
                      {/* 
                       * Celda de la tabla con la etiqueta del campo, capitalizando y reemplazando guiones bajos por espacios.
                       * Estilizada con la clase data-label.
                       */}
                      <td className="data-label">
                        <strong>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</strong>
                      </td>
                      {/* 
                       * Celda de la tabla con el valor del campo, serializado como JSON.
                       * Estilizada con la clase data-value.
                       */}
                      <td className="data-value">{JSON.stringify(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      {/* 
       * Botón para volver atrás, estilizado con la clase back-button.
       * Ejecuta el callback onBack al hacer clic.
       */}
      <button className="back-button" onClick={onBack}>
        Volver
      </button>
    </div>
  );
};

export default AllForms;