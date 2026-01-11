import React from 'react';
import './contact.css';

const Contact = ({ onBack }) => {
  return (
    <div className="page-card contact-card">
      <h2>Contato</h2>
      <p>Precisa de ajuda? Entre em contato via email ou telefone.</p>
      <ul>
        <li>Email: arthurceratti@gmail.com</li>
        <li>Telefone: +55 51 99275-8015</li>
      </ul>
      <div className="page-actions">
        <button className="back-btn" onClick={onBack}>Voltar</button>
      </div>
    </div>
  );
};

export default Contact;
