import React from "react";
import styles from "./Home.module.css";
import banner from "../../assets/banner_2.png";
import Card from "../../components/Card/Card";
import cards from "../../data/cards"

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <img src={banner} alt="Clubinhos NIB" className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>Bem-vindo ao Clubinhos NIB</h1>
          <p>Plataforma de evangelismo cristão para todas as idades.</p>
        </div>
      </section>

      {/* Cards Dinâmicos */}
      <section className={styles.cardsContainer}>
        {cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            image={card.image}
            link={card.link}
            
            type={card.type}
          />
        ))}
      </section>
    </div>
  );
};

export default Home;
