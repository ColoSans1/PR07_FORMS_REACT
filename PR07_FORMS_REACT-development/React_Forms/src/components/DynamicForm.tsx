import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/DynamicForm.css';

/* 
 * Interfaz para la configuración de un campo dentro del formulario.
 * Cada campo tiene un tipo (text, textarea, select, check) y puede tener restricciones y validaciones.
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
 * Interfaz que representa un formulario completo con su título y los campos que contiene.
 * El formulario tiene un identificador único y una lista de campos (Campo[]).
 */
interface Formulario {
  id: string;
  titulo: string;
  campos: Campo[];
}

/* 
 * Interfaz para los datos enviados por el usuario en el formulario.
 * El valor de cada campo puede ser un string, número o array de strings (en caso de selecciones múltiples).
 */
interface FormData {
  [key: string]: string | number | string[];
}

/* 
 * Propiedades esperadas por el componente DynamicForm.
 * - formType: el tipo de formulario a renderizar (academic, movie, etc.).
 * - onSubmit: función que se ejecuta cuando el formulario es enviado con los datos.
 */
interface DynamicFormProps {
  formType: 'academic' | 'movie' | 'personal' | 'tech';
  onSubmit: (data: FormData) => void;
}

/* 
 * Componente que maneja la lógica para renderizar un formulario dinámico.
 * Utiliza datos externos (JSON) para configurar los campos y manejar las validaciones.
 */
const DynamicForm: React.FC<DynamicFormProps> = ({ formType, onSubmit }) => {
  const { t, i18n } = useTranslation();  // Hook para manejar la traducción de textos.
  const [formData, setFormData] = useState<FormData>({});  // Estado para almacenar los datos ingresados.
  const [errors, setErrors] = useState<{ [key: string]: string }>({});  // Estado para los errores de validación.
  const [cuestionario, setCuestionario] = useState<Formulario[]>([]);  // Estado para almacenar la configuración del formulario.
  const [currentForm, setCurrentForm] = useState<Formulario | null>(null);  // Formulario actual que se está mostrando.

  // Orden de los formularios para mostrar la barra de progreso y determinar el porcentaje completado.
  const formOrder = ['personal', 'academic', 'tech', 'movie'];
  const currentIndex = formOrder.indexOf(formType);  // Índice del formulario actual en la lista.
  const progress = ((currentIndex + 1) / formOrder.length) * 100;  // Porcentaje de progreso en base al formulario actual.

  /* 
   * Efecto para cargar el formulario correspondiente desde un archivo JSON.
   * Se ejecuta cada vez que cambia el tipo de formulario o el idioma de la aplicación.
   */
  useEffect(() => {
    fetch('/cuestionario.json')
      .then(response => response.json())
      .then(data => {
        setCuestionario(data.formularios as Formulario[]);  // Almacena los formularios disponibles.
        const selectedForm = data.formularios.find((f: Formulario) => f.id === formType);  // Busca el formulario solicitado.
        setCurrentForm(selectedForm || null);  // Establece el formulario actual.
      })
      .catch(error => console.error(`Error al cargar el cuestionario para ${formType}:`, error));
  }, [formType, i18n.language]);  // Vuelve a ejecutarse cuando cambia el tipo de formulario o el idioma.

  /* 
   * Maneja el cambio en los campos del formulario y actualiza los datos correspondientes.
   * Si el valor del campo cambia, se actualiza el estado con el nuevo valor.
   */
  const handleChange = (id: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,  // Actualiza el valor del campo correspondiente.
    }));
    setErrors(prev => ({
      ...prev,
      [id]: '',  // Limpia cualquier error previo en el campo.
    }));
  };

  /* 
   * Valida un campo específico según sus restricciones y reglas de validación.
   * Devuelve un mensaje de error si la validación no se cumple, o una cadena vacía si es válida.
   */
  const validateField = (campo: Campo, value: string | string[]): string => {
    let error = '';

    // Valida la longitud del valor si existen restricciones de longitud.
    if (campo.restricciones) {
      const length = Array.isArray(value) ? value.join('').length : (value as string).length;
      if (length < campo.restricciones.min) {
        error = t('validation.minLength', { min: campo.restricciones.min });
      } else if (length > campo.restricciones.max) {
        error = t('validation.maxLength', { max: campo.restricciones.max });
      }
    }

    // Valida si el campo es un email o tiene otras reglas.
    if (campo.validacion) {
      if (campo.validacion.formato === 'email' && value) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value as string)) {
          error = t('validation.invalidEmail');
        }
        if (campo.validacion.dominio && value) {
          const emailDomain = (value as string).split('@')[1];
          if (emailDomain !== campo.validacion.dominio) {
            error = t('validation.invalidEmailDomain', { domain: campo.validacion.dominio });
          }
        }
      }

      // Valida la edad mínima si es un campo numérico.
      if (campo.validacion.min_edad && typeof value === 'string') {
        const numericValue = parseInt(value);
        if (isNaN(numericValue) || numericValue < campo.validacion.min_edad) {
          error = t('validation.minAge', { min: campo.validacion.min_edad });
        }
      }

      // Valida el número máximo de selecciones en un campo 'select' con múltiples opciones.
      if (campo.validacion.max_seleccionados && Array.isArray(value) && value.length > campo.validacion.max_seleccionados) {
        error = t('validation.maxSelections', { max: campo.validacion.max_seleccionados });
      }
    }

    return error;
  };

  /* 
   * Maneja el envío del formulario. Antes de enviar, valida todos los campos y muestra los errores.
   * Si no hay errores, llama a la función onSubmit proporcionada para enviar los datos.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentForm) return;
    let newErrors: { [key: string]: string } = {};
    currentForm.campos.forEach(campo => {
      const value = formData[campo.id] || '';
      const error = validateField(campo, value as string);
      if (error) newErrors[campo.id] = error;  // Agrega el error si no es válido.
    });
    setErrors(newErrors);

    // Si no hay errores, llama a la función onSubmit.
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  /* 
   * Renderiza un campo según su tipo (text, select, etc.).
   * Cada tipo de campo tiene su propio componente de entrada y lógica.
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
              placeholder={t('placeholder', { pregunta: t(campo.pregunta).toLowerCase() })}
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
              <option value="">{t('selectOption')}</option>
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
   * Renderiza la interfaz del formulario, mostrando la barra de progreso, los campos y el botón de envío.
   * Si el formulario aún no está disponible, muestra un mensaje de carga.
   */
  if (!currentForm) return <div className="page-container">{t('form.loading')}</div>;

  return (
    <div className="form-container">
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
