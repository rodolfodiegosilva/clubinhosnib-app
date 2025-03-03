import React, { useState } from "react";
import styles from "./Card.module.css";
import Modal from "../../components/Modal/Modal";

interface CardProps {
  title: string;
  description: string;
  image: string;
  link?: string;
  type?: string;
}

const Card: React.FC<CardProps> = ({ title, description, image, link, type }) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log("Card Rendered:", { title, description, image, link, type });

  const handleClick = () => {
    console.log("Card Clicked:", { type, link });
    if (type === "img" || type === "pdf") {
      setIsOpen(true);
    } else if (type === "page" && link) {
      console.log("Redirecting to:", link);
      window.location.href = link;
    }
  };

  // Função para transformar link do Google Drive em um link direto
  const getGoogleDriveUrl = (url: string) => {
    if (!url) return "";
    const match = url.match(/d\/(.*?)(\/|$)/);
    const transformedUrl = match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
    console.log("Google Drive URL Transform:", { url, transformedUrl });
    return transformedUrl;
  };

  return (
    <>
      <div className={styles.card} onClick={handleClick}>
        <img src={image} alt={title} className={styles.cardImage} />
        <div className={styles.cardContent}>
          <h3>{title}</h3>
          <p>{description}</p>
          {link && type === "page" && (
            <a href={link} className={styles.cardButton}>
              Saiba Mais
            </a>
          )}
        </div>
      </div>
      {isOpen && (
        <Modal onClose={() => { 
          console.log("Closing Modal");
          setIsOpen(false);
        }}>
          {type === "img" && (
            <img src={getGoogleDriveUrl(link || "")} alt={title} className={styles.modalImage} />
          )}
          {type === "pdf" && (
            <iframe
              src={`https://drive.google.com/file/d/${link?.split("/d/")[1]?.split("/")[0]}/preview`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            ></iframe>
          )}
        </Modal>
      )}
    </>
  );
};

export default Card;