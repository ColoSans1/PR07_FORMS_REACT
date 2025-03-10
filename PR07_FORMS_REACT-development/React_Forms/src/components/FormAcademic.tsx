import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Importar useTranslation

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

interface AcademicData {
  [key: string]: string | number | string[];
}

interface FormAcademicProps {
  onSubmit: (data: AcademicData) => void;
}

const FormAcademic: React.FC<FormAcademicProps> = ({ onSubmit }) => {
  const { t, i18n } = useTranslation(); // Usar useTranslation

  const [formData, setFormData] = useState<AcademicData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cuestionario, setCuestionario] = useState<Formulario[]>([]);
  const [currentForm, setCurrentForm] = useState<Formulario | null>(null);

  useEffect(() => {
    fetch('/cuestionario.json')
      .then(response => response.json())
      .then(data => {
        setCuestionario(data.formularios as Formulario[]);
        const academicForm = data.formularios.find((f: Formulario) => f.id === 'academic');
        setCurrentForm(academicForm || null);
      })
      .catch(error => console.error('Error al cargar el cuestionario desde public/cuestionario.json:', error));
  }, []);

  const hasQuestionnaire = cuestionario.length > 0;

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
      if (length < campo.restricciones.min) error = `${t('form.minLength')} ${campo.restricciones.min} ${t('form.characters')}`;
      else if (length > campo.restricciones.max) error = `${t('form.maxLength')} ${campo.restricciones.max} ${t('form.characters')}`;
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
            <label htmlFor={campo.id}>{campo.pregunta}</label>
            <input
              type="text"
              id={campo.id}
              name={campo.id}
              value={formData[campo.id] as string || ''}
              onChange={(e) => handleChange(campo.id, e.target.value)}
              placeholder={`Ingrese ${campo.pregunta.toLowerCase()}`}
              required
            />
            {errors[campo.id] && <span className="error">{errors[campo.id]}</span>}
          </div>
        );
      case 'select':
        return (
          <div key={campo.id} className="form-group">
            <label htmlFor={campo.id}>{campo.pregunta}</label>
            <select
              id={campo.id}
              name={campo.id}
              value={formData[campo.id] as string || ''}
              onChange={(e) => handleChange(campo.id, e.target.value)}
              required
            >
              <option value="">Selecciona una opción</option>
              {campo.opciones?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {errors[campo.id] && <span className="error">{errors[campo.id]}</span>}
          </div>
        );
      default:
        return null;
    }
  };
  

  if (!currentForm) return <div className="page-container">{t('form.loading')}</div>;  {/* Traducción para el estado de carga */}

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{currentForm.titulo}</h2>
      {currentForm.campos.map(campo => renderCampo(campo))}
      <button type="submit" className="start-button">{t('form.submitButton')}</button> {/* Botón traducido */}
    
    </form>
  );
};

export default FormAcademic;
