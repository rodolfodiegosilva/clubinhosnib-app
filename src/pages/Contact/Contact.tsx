import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso!');
    setForm({ nome: '', email: '', mensagem: '' });
  };

  return (
    <div>
      <div className={styles.contactContainer}>
        <h1 className={styles.contactTitle}>Fale Conosco</h1>
        <p>Entre em contato para saber mais informações.</p>

        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <label htmlFor="nome">Nome</label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            value={form.nome} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="mensagem">Mensagem</label>
          <textarea 
            id="mensagem" 
            name="mensagem" 
            value={form.mensagem} 
            onChange={handleChange} 
            required 
          />

          <button type="submit" className={styles.submitButton}>Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
