// Traemos React para usar el componente
import React from "react";
import { useTranslation } from "react-i18next";
import welcomeImage from '../styles/stucom-png-edit.png';

// Esto dice qué necesita el componente Home
// onStart: Función que se ejecuta al hacer clic en el botón de inicio
interface HomeProps {
  onStart: () => void;
}

// Componente Home: Página de bienvenida
const Home: React.FC<HomeProps> = ({ onStart }) => {
  const { t } = useTranslation(); // Hook para las traducciones

  return (
    // Contenedor principal de la página
    <div className="page-container">
      {/* Título de la página */}
      <h1>{t("home.title")}</h1>

      {/* Imagen de bienvenida */}
      <img src={welcomeImage} alt={t("home.imageAlt") || "Welcome Image"} className="welcome-image" />
      
      {/* Descripción de la página */}
      <p>{t("home.description")}</p>

      {/* Botón para iniciar */}
      <button className="start-button" onClick={onStart}>
        {t("home.startButton")}
      </button>
    </div>
  );
};

// Exportamos el componente
export default Home;
