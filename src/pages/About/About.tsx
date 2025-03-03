import React from "react";
import styles from "./About.module.css";

const About: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <h1>Quem Somos</h1>
        <p>
          O Clubinhos NIB é uma plataforma dedicada ao evangelismo e à edificação espiritual, 
          baseada nos princípios da fé cristã batista.
        </p>

        <h2>Nossa História</h2>
        <p>
          Com mais de 20 anos de trajetória, temos alcançado milhares de vidas através 
          de cultos, encontros e atividades transformadoras.
        </p>

        <h2>Missão e Visão</h2>
        <p>
          Nossa missão é compartilhar o evangelho com amor e clareza, enquanto nossa visão 
          é construir uma comunidade sólida e comprometida com os ensinamentos de Cristo.
        </p>
      </div>
    </div>
  );
};

export default About;
