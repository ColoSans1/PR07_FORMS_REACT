import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import PersonalForm from "./pages/PersonalForm";
import AcademicForm from "./pages/AcademicForm";
import TechPrefsForm from "./pages/TechPrefsForm";
import MoviePrefsForm from "./pages/MoviePrefsForm";
import Resumen from "./pages/Resumen";
import "./styles/forms.css";
import AllForms from "./pages/AllForms";

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
  tipo: "text" | "textarea" | "select" | "check";
  pregunta: string;
  restricciones?: { min: number; max: number };
  validacion?: {
    formato?: "email";
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
 * Interfaz que define el objeto de datos de los formularios completados.
 * - personal: (opcional) Datos del formulario personal (objeto con claves y valores de tipo string, number o string[]).
 * - academic: (opcional) Datos del formulario académico (objeto con claves y valores de tipo string, number o string[]).
 * - tech: (opcional) Datos del formulario de preferencias tecnológicas (objeto con claves y valores de tipo string, number o string[]).
 * - movie: (opcional) Datos del formulario de preferencias de cine (objeto con claves y valores de tipo string, number o string[]).
 */
interface FormData {
  personal?: { [key: string]: string | number | string[] };
  academic?: { [key: string]: string | number | string[] };
  tech?: { [key: string]: string | number | string[] };
  movie?: { [key: string]: string | number | string[] };
}

/* 
 * Componente principal de la aplicación.
 * Gestiona el estado de la página actual y los datos de los formularios.
 * Persiste los datos y la página actual en localStorage para mantener el progreso al recargar.
 * @returns {JSX.Element} - Elemento JSX con la aplicación renderizada.
 */
const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [paginaActual, setPaginaActual] = useState<string>(() => {
    // Recuperar la página actual de localStorage al cargar la aplicación
    const savedPage = localStorage.getItem("paginaActual");
    return savedPage || "bienvenida"; // Si no hay página guardada, inicia en "bienvenida"
  });
  const [formData, setFormData] = useState<FormData>(() => {
    // Recuperar los datos del formulario de localStorage al cargar la aplicación
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : {};
  });

  // Guardar formData en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // Guardar paginaActual en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("paginaActual", paginaActual);
  }, [paginaActual]);

  /* 
   * Maneja el envío de un formulario.
   * Valida que no haya campos vacíos y actualiza formData y paginaActual.
   * @param {Object} data - Datos del formulario enviado.
   * @param {string} formId - Identificador del formulario ('personal', 'academic', etc.).
   * @param {string} nextPage - Página a la que se navegará después de enviar.
   */
  const handleFormSubmit = (data: { [key: string]: string | number | string[] }, formId: string, nextPage: string) => {
    let hasErrors = false;
    Object.values(data).forEach((value) => {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        hasErrors = true;
      }
    });
    if (hasErrors) {
      alert(t("errors.completeFields"));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [formId]: data,
    }));
    setPaginaActual(nextPage);
  };

  /* 
   * Reinicia la aplicación.
   * Limpia formData, paginaActual y localStorage, volviendo a la página de bienvenida.
   */
  const handleReset = () => {
    setFormData({});
    setPaginaActual("bienvenida");
    localStorage.removeItem("formData");
    localStorage.removeItem("paginaActual");
  };

  /* 
   * Renderiza la página actual según el estado de paginaActual.
   * @returns {JSX.Element} - Componente correspondiente a la página actual.
   */
  const renderPagina = () => {
    switch (paginaActual) {
      case "bienvenida":
        return <Home onStart={() => setPaginaActual("personal")} />;
      case "personal":
        return <PersonalForm onSubmit={(data) => handleFormSubmit(data, "personal", "academic")} />;
      case "academic":
        return <AcademicForm onSubmit={(data) => handleFormSubmit(data, "academic", "tech")} />;
      case "tech":
        return <TechPrefsForm onSubmit={(data) => handleFormSubmit(data, "tech", "movie")} />;
      case "movie":
        return <MoviePrefsForm onSubmit={(data) => handleFormSubmit(data, "movie", "resumen")} />;
      case "resumen":
        return <Resumen formData={formData} onBack={() => setPaginaActual("bienvenida")} onReset={handleReset} />;
      case "allForms":
        return <AllForms formData={formData} onBack={() => setPaginaActual("bienvenida")} />;
      default:
        return <Home onStart={() => setPaginaActual("personal")} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t("app.title")}</h1>
        <div className="language-buttons">
          <button onClick={() => i18n.changeLanguage("es")}>🇪🇸 {t("language.spanish")}</button>
          <button onClick={() => i18n.changeLanguage("en")}>🇬🇧 {t("language.english")}</button>
          <button onClick={() => setPaginaActual("allForms")}>{t("app.viewAllForms")}</button>
        </div>
      </header>
      <section className="content-section">{renderPagina()}</section>
      <footer className="app-footer">
        <p>{t("app.footer")} - {new Date().toLocaleString()}</p>
      </footer>
      <p>{t("app.currentState")}: {t(`pages.${paginaActual}`)}</p>
    </div>
  );
};

export default App;