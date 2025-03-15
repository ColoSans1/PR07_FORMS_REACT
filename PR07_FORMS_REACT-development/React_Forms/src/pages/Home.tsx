import React from "react";
import { useTranslation } from "react-i18next";

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <h1>{t("home.title")}</h1>
      <p>{t("home.description")}</p>
      <button className="start-button" onClick={onStart}>
        {t("home.startButton")}
      </button>
    </div>
  );
};

export default Home;