import React from 'react';
import './products.css';

const Products = ({ onBack }) => {
  return (
    <div className="page-card products-card">
      <h2>Produtos</h2>
      <p>Apresente seus produtos aqui. Você pode descrever recursos, preços e benefícios.</p>
      <div className="page-actions">
        <button className="back-btn" onClick={onBack}>Voltar</button>
      </div>
    </div>
  );
};

export default Products;
