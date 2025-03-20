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
 * Estructura de un campo en un formulario.
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
 * Estructura de un formulario completo.
 */
interface Formulario {
  id: string;
  titulo: string;
  campos: Campo[];
}

/* 
 * Datos de los formularios completados.
 */
interface FormData {
  personal?: { [key: string]: string | number | string[] };
  academic?: { [key: string]: string | number | string[] };
  tech?: { [key: string]: string | number | string[] };
  movie?: { [key: string]: string | number | string[] };
}

/* 
 * Componente principal de la aplicación.
 */
const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [paginaActual, setPaginaActual] = useState<string>(() => {
    const savedPage = localStorage.getItem("paginaActual");
    return savedPage || "bienvenida";
  });
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : {};
  });

  // Guardar datos y página actual en localStorage
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("paginaActual", paginaActual);
  }, [paginaActual]);

  /* 
   * Maneja el envío de un formulario.
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
    setFormData((prev) => ({ ...prev, [formId]: data }));
    setPaginaActual(nextPage);
  };

  /* 
   * Reinicia la aplicación.
   */
  const handleReset = () => {
    setFormData({});
    setPaginaActual("bienvenida");
    localStorage.removeItem("formData");
    localStorage.removeItem("paginaActual");
  };

  /* 
   * Renderiza la página actual.
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
