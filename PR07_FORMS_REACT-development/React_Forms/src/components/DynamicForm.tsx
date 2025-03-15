import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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

interface Formulario {
  id: string;
  titulo: string;
  campos: Campo[];
}

interface FormData {
  [key: string]: string | number | string[];
}

interface DynamicFormProps {
  formType: 'academic' | 'movie' | 'personal' | 'tech';
  onSubmit: (data: FormData) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formType, onSubmit }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cuestionario, setCuestionario] = useState<Formulario[]>([]);
  const [currentForm, setCurrentForm] = useState<Formulario | null>(null);

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

  const handleChange = (id: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [id]: '',
    }));
  };

  const validateField = (campo: Campo, value: string | string[]): string => {
    let error = '';

    if (campo.restricciones) {
      const length = Array.isArray(value) ? value.join('').length : (value as string).length;
      if (length < campo.restricciones.min) {
        error = t('validation.minLength', { min: campo.restricciones.min }) || `Debe tener al menos ${campo.restricciones.min} caracteres`;
      } else if (length > campo.restricciones.max) {
        error = t('validation.maxLength', { max: campo.restricciones.max }) || `No puede tener más de ${campo.restricciones.max} caracteres`;
      }
    }

    if (campo.validacion) {
      if (campo.validacion.formato === 'email' && value) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value as string)) {
          error = t('validation.invalidEmail') || 'El email no es válido';
        }
        if (campo.validacion.dominio && value) {
          const emailDomain = (value as string).split('@')[1];
          if (emailDomain !== campo.validacion.dominio) {
            error = t('validation.invalidEmailDomain', { domain: campo.validacion.dominio }) || `El email debe pertenecer al dominio ${campo.validacion.dominio}`;
          }
        }
      }

      if (campo.validacion.min_edad && typeof value === 'string') {
        const numericValue = parseInt(value);
        if (isNaN(numericValue) || numericValue < campo.validacion.min_edad) {
          error = t('validation.minAge', { min: campo.validacion.min_edad }) || `La edad debe ser mayor a ${campo.validacion.min_edad}`;
        }
      }

      if (campo.validacion.max_seleccionados && Array.isArray(value) && value.length > campo.validacion.max_seleccionados) {
        error = t('validation.maxSelections', { max: campo.validacion.max_seleccionados }) || `Máximo ${campo.validacion.max_seleccionados} opciones permitidas`;
      }
    }

    if (campo.id === 'experienceYears' && typeof value === 'string') {
      const years = parseInt(value);
      if (isNaN(years) || years < (campo.validacion?.min_edad || 0)) {
        error = t('validation.minExperience', { min: campo.validacion?.min_edad }) || `Los años de experiencia deben ser mayor a ${campo.validacion?.min_edad || 0}`;
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
              {campo.opciones?.map(option => (
                <option key={option} value={t(option)}>{t(option)}</option>
              ))}
            </select>
            {errors[campo.id] && <span className="error">{errors[campo.id]}</span>}
          </div>
        );
      default:
        return null;
    }
  };

  if (!currentForm) return <div className="page-container">{t('form.loading') || 'Cargando...'}</div>;

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{t(currentForm.titulo)}</h2>
      {currentForm.campos.map(campo => renderCampo(campo))}
      <button type="submit" className="start-button">
        {t(`form.${formType}SubmitButton`) || 'Siguiente'}
      </button>
    </form>
  );
};

export default DynamicForm;