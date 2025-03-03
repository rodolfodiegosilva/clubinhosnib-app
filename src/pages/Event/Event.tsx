import React from "react";
import styles from "./Event.module.css";

const eventos = [
  {
    id: 1,
    title: "Culto da Família",
    date: "12 de Março",
    location: "Igreja Batista Central",
  },
  {
    id: 2,
    title: "Noite de Louvor",
    date: "18 de Março",
    location: "Templo Sede",
  },
  {
    id: 3,
    title: "Evangelismo nas Ruas",
    date: "25 de Março",
    location: "Centro da Cidade",
  },
];

const Eventos: React.FC = () => {
  return (
    <div className={styles.eventosContainer}>
      <h1 className={styles.title}>
        📅 <span>Próximos Eventos</span>
      </h1>

      <div className={styles.cardsContainer}>
        {eventos.map((evento) => (
          <div key={evento.id} className={styles.eventCard}>
            <h2>{evento.title}</h2>
            <p>
              📅 <strong>Data:</strong> {evento.date}
            </p>
            <p>
              📍 <strong>Local:</strong> {evento.location}
            </p>
            <button className={styles.detailsButton}>Ver Detalhes</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Eventos;
