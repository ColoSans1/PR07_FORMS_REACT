import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/DynamicForm.css';

/* 
 * Definición del campo del formulario.
 * id: Identificador único.
 * tipo: Tipo de campo (texto, área, selección, check).
 * pregunta: Texto de la pregunta (clave de traducción).
 * restricciones: Límites de longitud.
 * validacion: Reglas de validación (ej. email, edad mínima).
 * opciones: Opciones para campos de tipo 'select'.
 */
interface Campo {
  id: string;
  tipo: 'text' | 'textarea' | 'select' | 'check';
  pregunta: string;
  restricciones?: { min: number; max: number };
  validacion?: {
    formato?: 'email';
    dominio?: string;
    min_edad?: number;
    max_seleccionados?: number;
  };
  opciones?: string[];
}

/* 
 * Definición del formulario.
 * id: Identificador del formulario.
 * titulo: Título del formulario (clave de traducción).
 * campos: Lista de campos que contiene el formulario.
 */
interface Formulario {
  id: string;
  titulo: string;
  campos: Campo[];
}

/* 
 * Datos del formulario.
 * key: valor de cada campo.
 */
interface FormData {
  [key: string]: string | number | string[];
}

/* 
 * Props para el componente DynamicForm.
 * formType: Tipo de formulario a renderizar.
 * onSubmit: Función que se ejecuta al enviar el formulario.
 */
interface DynamicFormProps {
  formType: 'academic' | 'movie' | 'personal' | 'tech';
  onSubmit: (data: FormData) => void;
}

/* 
 * Componente para renderizar formularios dinámicos.
 * Muestra progreso, validación y guarda datos en localStorage.
 */
const DynamicForm: React.FC<DynamicFormProps> = ({ formType, onSubmit }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem("formData");
    const parsedData = savedData ? JSON.parse(savedData) : {};
    return parsedData[formType] || {};
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cuestionario, setCuestionario] = useState<Formulario[]>([]);
  const [currentForm, setCurrentForm] = useState<Formulario | null>(null);

  const formOrder = ['personal', 'academic', 'tech', 'movie'];
  const currentIndex = formOrder.indexOf(formType);
  const progress = ((currentIndex + 1) / formOrder.length) * 100;

  const totalFields = currentForm?.campos.length || 0;
  const completedFields = Object.values(formData).filter(value => value !== '' && value !== undefined).length;

  useEffect(() => {
    fetch('/cuestionario.json')
      .then(response => response.json())
      .then(data => {
        setCuestionario(data.formularios as Formulario[]);
        const selectedForm = data.formularios.find((f: Formulario) => f.id === formType);
        setCurrentForm(selectedForm || null);
      })
      .catch(error => console.error(`Error al cargar el cuestionario:`, error));
  }, [formType, i18n.language]);

  const handleChange = (id: string, value: string | string[]) => {
    setFormData(prev => {
      const updatedFormData = { ...prev, [id]: value };
      const savedData = localStorage.getItem("formData");
      const parsedData = savedData ? JSON.parse(savedData) : {};
      localStorage.setItem("formData", JSON.stringify({ ...parsedData, [formType]: updatedFormData }));
      return updatedFormData;
    });
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const validateField = (campo: Campo, value: string | string[]): string => {
    let error = '';

    if (campo.restricciones) {
      const length = Array.isArray(value) ? value.join('').length : (value as string).length;
      if (length < campo.restricciones.min) {
        error = `Debe tener al menos ${campo.restricciones.min} caracteres`;
      } else if (length > campo.restricciones.max) {
        error = `No puede tener más de ${campo.restricciones.max} caracteres`;
      }
    }

    if (campo.validacion?.formato === 'email' && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value as string)) {
        error = 'El email no es válido';
      }
    }

    return error;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentForm) return;
    let newErrors: { [key: string]: string } = {};
    currentForm.campos.forEach(campo => {
      const value = formData[campo.id] || '';
      const error = validateField(campo, value as string);
      if (error) newErrors[campo.id] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const renderCampo = (campo: Campo) => {
    switch (campo.tipo) {
      case 'text':
        return (
          <div key={campo.id} className="form-group">
            <label htmlFor={campo.id}>{t(campo.pregunta)}</label>
            <input
              type="text"
              id={campo.id}
              name={campo.id}
              value={formData[campo.id] as string || ''}
              onChange={(e) => handleChange(campo.id, e.target.value)}
              required
            />
            {errors[campo.id] && <span className="error">{errors[campo.id]}</span>}
          </div>
        );
      case 'select':
        return (
          <div key={campo.id} className="form-group">
            <label htmlFor={campo.id}>{t(campo.pregunta)}</label>
            <select
              id={campo.id}
              name={campo.id}
              value={formData[campo.id] as string || ''}
              onChange={(e) => handleChange(campo.id, e.target.value)}
              required
            >
              <option value="">Selecciona una opción</option>
              {campo.opciones?.map((option, index) => (
                <option key={index} value={option}>
                  {t(option)}
                </option>
              ))}
            </select>
            {errors[campo.id] && <span className="error">{errors[campo.id]}</span>}
          </div>
        );
      default:
        return null;
    }
  };

  if (!currentForm) return <div className="page-container">Cargando...</div>;

  return (
    <div className="form-container">
      {/* Barra de progreso */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <span className="progress-text">{`Formulario ${currentIndex + 1} de ${formOrder.length}`}</span>
      </div>
      {/* Contador de campos completados */}
      <div className="fields-counter">
        <span>{`Campos completados: ${completedFields}/${totalFields}`}</span>
      </div>
      <form onSubmit={handleSubmit}>
        <h2>{t(currentForm.titulo)}</h2>
        {currentForm.campos.map(campo => renderCampo(campo))}
        <button type="submit" className="start-button">
          Siguiente
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
