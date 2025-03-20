import React from "react";
import { useTranslation } from "react-i18next";
import welcomeImage from '../styles/stucom-png-edit.png';

/* 
 * Propiedades del componente Home.
 * onStart: Función ejecutada al hacer clic en el botón de inicio.
 */
interface HomeProps {
  onStart: () => void;
}

/* 
 * Componente de la página de bienvenida.
 * Muestra un título, una imagen y un botón para iniciar el flujo de formularios.
 * Utiliza react-i18next para soportar traducciones.
 */
const Home: React.FC<HomeProps> = ({ onStart }) => {
  const { t } = useTranslation(); // Hook para traducciones

  return (
    <div className="page-container">
      <h1>{t("home.title")}</h1>
      <img src={welcomeImage} alt={t("home.imageAlt") || "Welcome Image"} className="welcome-image" />
      <p>{t("home.description")}</p>
      <button className="start-button" onClick={onStart}>
        {t("home.startButton")}
      </button>
    </div>
  );
};

export default Home;
