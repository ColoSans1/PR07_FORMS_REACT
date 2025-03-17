import React from "react";
import { useTranslation } from "react-i18next";
import welcomeImage from '../styles/stucom-png-edit.png';
/* 
 * Interfaz que define las propiedades del componente Home.
 * - onStart: Callback ejecutado al hacer clic en el botón de inicio (function).
 *   Se utiliza para iniciar el flujo de formularios.
 */
interface HomeProps {
  onStart: () => void;
}

/* 
 * Componente React que representa la página de bienvenida de la aplicación.
 * Muestra un título, una descripción, una imagen de bienvenida y un botón para comenzar el flujo de formularios.
 * Utiliza react-i18next para soportar traducciones multilingües.
 * @param {HomeProps} props - Propiedades del componente.
 * @returns {JSX.Element} - Elemento JSX con la página de bienvenida renderizada.
 */

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const { t } = useTranslation(); /* Hook para acceder a las traducciones definidas en los archivos de i18next (es.json, en.json). */

  return (
    <div className="page-container">
      
      {/* 
       * Título de la página, traducido mediante la clave 'home.title'.
       * Por ejemplo, "Página de Bienvenida" (es) o "Welcome Page" (en).
       */}
      <h1>{t("home.title")}</h1>
      {/* 
       * Imagen de bienvenida, ubicada en la carpeta public/images.
       * La ruta '/images/welcome-image.jpg' asume que la imagen está en public/images.
       * Añade la clase 'welcome-image' para estilizarla (definida en Home.css).
       */}
<img src={welcomeImage} alt={t("home.imageAlt") || "Welcome Image"} className="welcome-image" />      {/* 
       * Descripción de la página, traducida mediante la clave 'home.description'.
       * Proporciona instrucciones sobre cómo usar la aplicación.
       */}
      <p>{t("home.description")}</p>
      {/* 
       * Botón para iniciar el flujo de formularios, estilizado con la clase start-button.
       * El texto del botón se traduce mediante la clave 'home.startButton'.
       * Ejecuta el callback onStart al hacer clic.
       */}
      <button className="start-button" onClick={onStart}>
        {t("home.startButton")}
      </button>
    </div>
  );
};

export default Home;