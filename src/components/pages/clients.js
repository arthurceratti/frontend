import React from 'react';
import './clients.css';

const Clients = ({ onBack }) => {
  return (
    <div className="page-card clients-card">
      <h2>Clientes</h2>
      <p>Aqui você pode destacar clientes, estudos de caso e depoimentos.</p>
      <div className="page-actions">
        <button className="back-btn" onClick={onBack}>Voltar</button>
      </div>
    </div>
  );
};

export default Clients;
