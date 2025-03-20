// Traemos React para usar el componente
import React from "react";

// Traemos el archivo CSS para darle estilo
import "../assets/AllForms.css";

// Esto dice qué necesita el componente AllForms
// formData: Los datos de los formularios ya llenos
// onBack: Una función para volver atrás
interface AllFormsProps {
  formData: { [key: string]: any };
  onBack: () => void;
}

// Este es el componente AllForms
// Muestra todos los formularios que ya llenaste
const AllForms: React.FC<AllFormsProps> = ({ formData, onBack }) => {
  return (
    // Esto es una caja que contiene todo
    <div className="all-forms-container">
      {/* Título que dice "Formularios Completados" */}
      <h2 className="all-forms-title">Formularios Completados</h2>

      {/* Si no hay datos, mostramos un mensaje */}
      {Object.keys(formData).length === 0 ? (
        // Mensaje que dice que no hay formularios
        <div className="no-data-message">
          <p>No hay formularios completados.</p>
        </div>
      ) : (
        // Si hay datos, mostramos los formularios en tarjetas
        <div className="forms-grid">
          {/* Recorremos cada formulario */}
          {Object.entries(formData).map(([formName, data]) => (
            // Cada formulario tiene su tarjeta
            <div key={formName} className="form-card">
              {/* Título de la tarjeta, pone la primera letra en mayúscula */}
              <h3 className="form-card-title">
                {formName.charAt(0).toUpperCase() + formName.slice(1)}
              </h3>
              {/* Tabla para mostrar los datos */}
              <table className="data-table">
                <tbody>
                  {/* Recorremos cada dato del formulario */}
                  {Object.entries(data).map(([key, value]) => (
                    // Cada dato es una fila en la tabla
                    <tr key={key} className="data-row">
                      {/* Nombre del campo, con la primera letra en mayúscula */}
                      <td className="data-label">
                        <strong>
                          {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:
                        </strong>
                      </td>
                      {/* Valor del campo */}
                      <td className="data-value">{JSON.stringify(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Botón para volver atrás */}
      <button className="back-button" onClick={onBack}>
        Volver
      </button>
    </div>
  );
};

// Exportamos el componente para usarlo en otros archivos
export default AllForms;