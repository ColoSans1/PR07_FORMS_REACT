import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/DynamicForm.css';

/* 
  Definición de la estructura de un campo de formulario.
  Cada campo tiene propiedades como:
  - id: Identificador único del campo.
  - tipo: Tipo de campo (text, textarea, select, check).
  - pregunta: Texto que describe el campo.
  - restricciones: Reglas de longitud mínima y máxima para campos de texto.
  - validacion: Reglas adicionales de validación (por ejemplo, correo electrónico, edad mínima, etc.).
  - opciones: Lista de opciones para campos de tipo select.
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
  Definición de la estructura de un formulario completo.
  Cada formulario tiene un identificador, un título y una lista de campos.
*/
interface Formulario {
  id: string;
  titulo: string;
  campos: Campo[];
}

/* 
  Estructura de los datos ingresados por el usuario en el formulario.
  Almacena los valores de cada campo del formulario.
*/
interface FormData {
  [key: string]: string | number | string[];
}

/* 
  Props que recibe el componente DynamicForm.
  Incluye el tipo de formulario (personal, academic, etc.) y la función onSubmit.
*/
interface DynamicFormProps {
  formType: 'academic' | 'movie' | 'personal' | 'tech'; // Tipo de formulario
  onSubmit: (data: FormData) => void; // Función que se ejecuta al enviar el formulario
}

/* 
  Componente que renderiza formularios dinámicos con validación y progreso visual.
  - formType: Tipo de formulario a renderizar.
  - onSubmit: Función de callback que se llama al enviar el formulario.
*/
const DynamicForm: React.FC<DynamicFormProps> = ({ formType, onSubmit }) => {
  const { t, i18n } = useTranslation(); // Hook para traducción de textos.
  const [formData, setFormData] = useState<FormData>(() => {
    // Carga los datos previos desde el localStorage (si existen) para mantener el estado entre sesiones.
    const savedData = localStorage.getItem("formData");
    const parsedData = savedData ? JSON.parse(savedData) : {};
    return parsedData[formType] || {};
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Almacena los errores de validación de cada campo.
  const [cuestionario, setCuestionario] = useState<Formulario[]>([]); // Datos del formulario cargados desde el archivo JSON.
  const [currentForm, setCurrentForm] = useState<Formulario | null>(null); // Formulario actual a mostrar.

  // Cálculo del progreso basado en el orden de los formularios.
  const formOrder = ['personal', 'academic', 'tech', 'movie'];
  const currentIndex = formOrder.indexOf(formType);
  const progress = ((currentIndex + 1) / formOrder.length) * 100;

  // Conteo de campos completados
  const totalFields = currentForm?.campos.length || 0;
  const completedFields = Object.values(formData).filter(value => 
    value !== '' && value !== undefined && value !== null && 
    (typeof value !== 'string' || value.trim() !== '') &&
    (!Array.isArray(value) || value.length > 0)
  ).length;

  /* 
    Efecto que se ejecuta al cargar el componente. 
    Carga el archivo JSON con los formularios y selecciona el formulario correspondiente.
  */
  useEffect(() => {
    fetch('/cuestionario.json')
      .then(response => response.json())
      .then(data => {
        setCuestionario(data.formularios as Formulario[]);
        const selectedForm = data.formularios.find((f: Formulario) => f.id === formType);
        setCurrentForm(selectedForm || null);
      })
      .catch(error => console.error(`Error al cargar el cuestionario para ${formType}:`, error));
  }, [formType, i18n.language]);

  /* 
    Maneja el cambio de valor en los campos del formulario.
    Actualiza el estado de formData y guarda los datos en localStorage.
  */
  const handleChange = (id: string, value: string | string[]) => {
    setFormData(prev => {
      const updatedFormData = {
        ...prev,
        [id]: value,
      };
      const savedData = localStorage.getItem("formData");
      const parsedData = savedData ? JSON.parse(savedData) : {};
      localStorage.setItem("formData", JSON.stringify({
        ...parsedData,
        [formType]: updatedFormData,
      }));
      return updatedFormData;
    });
    setErrors(prev => ({
      ...prev,
      [id]: '',
    }));
  };

  /* 
    Valida un campo según sus restricciones y reglas de validación.
    Si el campo no cumple con las reglas, retorna un mensaje de error.
  */
  const validateField = (campo: Campo, value: string | string[]): string => {
    let error = '';

    if (campo.restricciones) {
      // Validación de longitud mínima y máxima
      const length = Array.isArray(value) ? value.join('').length : (value as string).length;
      if (length < campo.restricciones.min) {
        error = t('validation.minLength', { min: campo.restricciones.min }) || `Debe tener al menos ${campo.restricciones.min} caracteres`;
      } else if (length > campo.restricciones.max) {
        error = t('validation.maxLength', { max: campo.restricciones.max }) || `No puede tener más de ${campo.restricciones.max} caracteres`;
      }
    }

    if (campo.validacion) {
      // Validación de formato de correo electrónico
      if (campo.validacion.formato === 'email' && value) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value as string)) {
          error = t('validation.invalidEmail') || 'El email no es válido';
        }
        // Validación de dominio de correo electrónico
        if (campo.validacion.dominio && value) {
          const emailDomain = (value as string).split('@')[1];
          if (emailDomain !== campo.validacion.dominio) {
            error = t('validation.invalidEmailDomain', { domain: campo.validacion.dominio }) || `El email debe pertenecer al dominio ${campo.validacion.dominio}`;
          }
        }
      }

      // Validación de edad mínima
      if (campo.validacion.min_edad && typeof value === 'string') {
        const numericValue = parseInt(value);
        if (isNaN(numericValue) || numericValue < campo.validacion.min_edad) {
          error = t('validation.minAge', { min: campo.validacion.min_edad }) || `La edad debe ser mayor a ${campo.validacion.min_edad}`;
        }
      }

      // Validación de número máximo de opciones seleccionadas
      if (campo.validacion.max_seleccionados && Array.isArray(value) && value.length > campo.validacion.max_seleccionados) {
        error = t('validation.maxSelections', { max: campo.validacion.max_seleccionados }) || `Máximo ${campo.validacion.max_seleccionados} opciones permitidas`;
      }
    }

    return error;
  };

  /* 
    Maneja el envío del formulario.
    Primero valida todos los campos y, si no hay errores, ejecuta la función onSubmit.
  */
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
      onSubmit(formData); // Llama a la función onSubmit si no hay errores
    }
  };

  /* 
    Renderiza un campo del formulario según su tipo.
    Dependiendo del tipo de campo, se renderiza un input, un select, etc.
  */
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
              placeholder={t('placeholder', { pregunta: t(campo.pregunta).toLowerCase() }) || `Ingrese ${t(campo.pregunta).toLowerCase()}`}
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
              <option value="">{t('selectOption') || 'Selecciona una opción'}</option>
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

  /* 
    Si no hay formulario seleccionado, se muestra un mensaje de carga.
    De lo contrario, renderiza el formulario con los campos y el progreso.
  */
  if (!currentForm) return <div className="page-container">{t('form.loading') || 'Cargando...'}</div>;

  return (
    <div className="form-container">
      {/* Barra de progreso */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <span className="progress-text">{t('form.progress', { current: currentIndex + 1, total: formOrder.length })}</span>
      </div>
      {/* Contador de campos completados */}
      <div className="fields-counter">
        <span>
          {t('form.completedFields', { completed: completedFields, total: totalFields }) || `Fields completed: ${completedFields}/${totalFields}`}
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <h2>{t(currentForm.titulo)}</h2>
        {currentForm.campos.map(campo => renderCampo(campo))}
        <button type="submit" className="start-button">
          {t(`form.${formType}SubmitButton`) || 'Siguiente'}
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
