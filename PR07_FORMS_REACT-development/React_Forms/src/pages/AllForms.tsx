import React from "react";
import "../assets/AllForms.css"; // Asegúrate de crear este archivo CSS

/* 
 * Propiedades del componente AllForms.
 * formData: Datos de los formularios completados.
 * onBack: Función que se ejecuta al hacer clic en "Volver".
 */
interface AllFormsProps {
  formData: { [key: string]: any };
  onBack: () => void;
}

/* 
 * Componente que muestra un resumen de los formularios completados.
 * Muestra las tarjetas con los datos y un botón para volver.
 */
const AllForms: React.FC<AllFormsProps> = ({ formData, onBack }) => {
  return (
    <div className="all-forms-container">
      <h2 className="all-forms-title">Formularios Completados</h2>
      {Object.keys(formData).length === 0 ? (
        <div className="no-data-message">
          <p>No hay formularios completados.</p>
        </div>
      ) : (
        <div className="forms-grid">
          {Object.entries(formData).map(([formName, data]) => (
            <div key={formName} className="form-card">
              <h3 className="form-card-title">{formName.charAt(0).toUpperCase() + formName.slice(1)}</h3>
              <table className="data-table">
                <tbody>
                  {Object.entries(data).map(([key, value]) => (
                    <tr key={key} className="data-row">
                      <td className="data-label">
                        <strong>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</strong>
                      </td>
                      <td className="data-value">{JSON.stringify(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      <button className="back-button" onClick={onBack}>
        Volver
      </button>
    </div>
  );
};

export default AllForms;
