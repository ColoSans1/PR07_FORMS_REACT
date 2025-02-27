/* Componente principal que maneja la navegación y estado de los formularios */
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import PersonalForm from './pages/PersonalForm';
import AcademicForm from './pages/AcademicForm';
import TechPrefsForm from './pages/TechPrefsForm';
import MoviePrefsForm from './pages/MoviePrefsForm';
import Resumen from './pages/Resumen';
import './styles/forms.css';



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
  personal?: { [key: string]: string | number | string[] };
  academic?: { [key: string]: string | number | string[] };
  tech?: { [key: string]: string | number | string[] };
  movie?: { [key: string]: string | number | string[] };
}

/* Componente App que gestiona la navegación secuencial y los datos de los formularios */
const App: React.FC = () => {
  const [paginaActual, setPaginaActual] = useState('bienvenida');
  const [formData, setFormData] = useState<FormData>({});

  // Recuperar datos del localStorage al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleFormSubmit = (data: { [key: string]: string | number | string[] }, formId: string, nextPage: string) => {
    let hasErrors = false;
    Object.values(data).forEach(value => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        hasErrors = true;
      }
    });
    if (hasErrors) {
      alert('Por favor, completa todos los campos correctamente antes de continuar.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      [formId]: data,
    }));
    setPaginaActual(nextPage);
  };

  const handleReset = () => {
    setFormData({});
    setPaginaActual('bienvenida');
    localStorage.removeItem('formData');
  };

  const renderPagina = () => {
    switch (paginaActual) {
      case 'bienvenida':
        return <Home onStart={() => setPaginaActual('personal')} />;
      case 'personal':
        return <PersonalForm onSubmit={(data) => handleFormSubmit(data, 'personal', 'academic')} />;
      case 'academic':
        return <AcademicForm onSubmit={(data) => handleFormSubmit(data, 'academic', 'tech')} />;
      case 'tech':
        return <TechPrefsForm onSubmit={(data) => handleFormSubmit(data, 'tech', 'movie')} />;
      case 'movie':
        return <MoviePrefsForm onSubmit={(data) => handleFormSubmit(data, 'movie', 'resumen')} />;
      case 'resumen':
        return <Resumen formData={formData} onBack={() => setPaginaActual('bienvenida')} onReset={handleReset} />;
      default:
        return <Home onStart={() => setPaginaActual('personal')} />;
    }
  };

  return (
    <div className="app">
<header className="app-header">
  <h1>PR07_FORMS_REACT</h1>
  <button>ES</button>
  <button>EN</button>
</header>
      <section className="content-section">
        {renderPagina()}
      </section>
      <footer className="app-footer">
        <p>PR07_FORMS_REACT - {new Date().toLocaleString()}</p>
      </footer>
      <p>Estado actual: {paginaActual}</p>
    </div>
  );
};

export default App;