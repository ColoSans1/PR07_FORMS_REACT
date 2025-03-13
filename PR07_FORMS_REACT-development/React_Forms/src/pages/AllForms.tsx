import React from "react";

interface AllFormsProps {
  formData: { [key: string]: any };
  onBack: () => void;
}

const AllForms: React.FC<AllFormsProps> = ({ formData, onBack }) => {
  return (
    <div className="all-forms">
      <h2>Formularios Completados</h2>
      {Object.keys(formData).length === 0 ? (
        <p>No hay formularios completados.</p>
      ) : (
        Object.entries(formData).map(([formName, data]) => (
          <div key={formName} className="form-section">
            <h3>{formName}</h3>
            <ul>
              {Object.entries(data).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {JSON.stringify(value)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      <button onClick={onBack}>Volver</button>
    </div>
  );
};

export default AllForms;
