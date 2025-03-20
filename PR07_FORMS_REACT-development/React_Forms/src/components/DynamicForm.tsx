import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/DynamicForm.css';

/* 
 * Interfaz que define la estructura de un campo dentro de un formulario.
 * - id: Identificador único del campo (string).
 * - tipo: Tipo de campo ('text', 'textarea', 'select', 'check') (string).
 * - pregunta: Clave de traducción para la etiqueta del campo (string).
 * - restricciones: (opcional) Objeto con límites de longitud (min, max) (number).
 * - validacion: (opcional) Objeto con reglas de validación (formato, dominio, min_edad, max_seleccionados) (string | number).
 * - opciones: (opcional) Array de opciones para campos 'select' (string[]).
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
 * Interfaz que define la estructura de un formulario completo.
 * - id: Identificador único del formulario ('personal', 'academic', 'tech', 'movie') (string).
 * - titulo: Clave de traducción para el título del formulario (string).
 * - campos: Array de campos que componen el formulario (Campo[]).
 */
interface Formulario {
  id: string;
  titulo: string;
  campos: Campo[];
}

/* 
 * Interfaz que define el objeto de datos ingresados por el usuario.
 * - [key: string]: Valor del campo (string, number, o string[]).
 */
interface FormData {
  [key: string]: string | number | string[];
}

/* 
 * Interfaz de props para el componente DynamicForm.
 * - formType: Tipo de formulario a renderizar ('academic', 'movie', 'personal', 'tech') (string).
 * - onSubmit: Callback ejecutado al enviar el formulario con los datos (function).
 */
interface DynamicFormProps {
  formType: 'academic' | 'movie' | 'personal' | 'tech';
  onSubmit: (data: FormData) => void;
}

/* 
 * Componente React que renderiza formularios dinámicos basados en cuestionario.json.
 * Maneja la lógica de campos, validaciones, progreso visual y traducción multilingüe.
 * @param {DynamicFormProps} props - Propiedades del componente.
 * @returns {JSX.Element} - Elemento JSX con el formulario renderizado.
 */
const DynamicForm: React.FC<DynamicFormProps> = ({ formType, onSubmit }) => {
  const { t, i18n } = useTranslation(); /* Hook para acceder a las traducciones definidas en los archivos de i18next (es.json, en.json). */
  const [formData, setFormData] = useState<FormData>({}); /* Estado para almacenar los datos del formulario. */
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); /* Estado para almacenar errores de validación. */
  const [cuestionario, setCuestionario] = useState<Formulario[]>([]); /* Estado para almacenar los formularios cargados desde JSON. */
  const [currentForm, setCurrentForm] = useState<Formulario | null>(null); /* Estado para el formulario actual. */

  /* 
   * Orden de los formularios para calcular el progreso.
   * Usado para determinar la posición actual y el porcentaje de progreso.
   */
  const formOrder = ['personal', 'academic', 'tech', 'movie'];
  const currentIndex = formOrder.indexOf(formType); /* Índice del formulario actual en el orden. */
  const progress = ((currentIndex + 1) / formOrder.length) * 100; /* Porcentaje de progreso (25%, 50%, 75%, 100%). */

  /* 
   * Efecto para cargar el cuestionario desde cuestionario.json al montar o cambiar idioma.
   * @effect Se ejecuta cuando cambian formType o i18n.language.
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
   * Maneja el cambio en los campos del formulario.
   * @param {string} id - Identificador del campo.
   * @param {string | string[]} value - Valor ingresado o seleccionado.
   */
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

  /* 
   * Valida un campo según sus restricciones y reglas.
   * @param {Campo} campo - Configuración del campo a validar.
   * @param {string | string[]} value - Valor a validar.
   * @returns {string} - Mensaje de error o cadena vacía si es válido.
   */
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

  /* 
   * Maneja el envío del formulario.
   * Valida todos los campos y llama onSubmit si no hay errores.
   * @param {React.FormEvent} e - Evento del formulario.
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
      onSubmit(formData);
    }
  };

  /* 
   * Renderiza un campo según su tipo.
   * @param {Campo} campo - Configuración del campo a renderizar.
   * @returns {JSX.Element | null} - Elemento JSX del campo o null si el tipo no es soportado.
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


   /*
    ----------PARTE EXTRA --------------------------
   */
  /* 
   * Renderiza el formulario completo con barra de progreso, campos y botón de envío.
   * Muestra un mensaje de carga si el formulario no está listo.
   * @returns {JSX.Element} - Elemento JSX del formulario.
   */
  if (!currentForm) return <div className="page-container">{t('form.loading') || 'Cargando...'}</div>;

  return (
    <div className="form-container">
      {/* Barra de progreso */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <span className="progress-text">{t('form.progress', { current: currentIndex + 1, total: formOrder.length })}</span>
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