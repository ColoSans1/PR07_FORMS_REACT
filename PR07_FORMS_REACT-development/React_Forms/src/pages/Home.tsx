/* Página de bienvenida con instrucciones y botón para empezar */
import React from 'react';

interface HomeProps {
  onStart: () => void; // Prop para iniciar los formularios
}

/* Componente Home que muestra la página inicial con instrucciones */
const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="page-container">
      <h1>Página de Bienvenida</h1>
      <p>
        Esta aplicación te permite completar una serie de cuestionarios para recopilar información personal, evaluaciones 
        académicas, preferencias en tecnología y preferencias en cine. Sigue las instrucciones a continuación para realizar 
        los formularios: Completa cada formulario consecutivamente. Revisa los errores antes de avanzar al siguiente 
        formulario. Al finalizar, verás un resumen con toda tu información.
      </p>
      <button className="start-button" onClick={onStart}>
        Comenzar Formularios
      </button>
    </div>
  );
};

export default Home;