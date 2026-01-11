import React from 'react';
import axios from 'axios';
import './areaclient.css';

const retrieveClientData = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/show-data`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
    alert('access show data!');
    // Aggregate all received data into `responseData`
    const responseData = response.data;
    console.log('Client data retrieved:', responseData);

    return responseData;
  } catch (error) {
    console.error('Error fetching client data:', error);
    return null;
  }
}



const AreaClient = ({ onBack }) => {
    const response = retrieveClientData();
    console.log("Response in AreaClient:", response.data);
  return (
    <div className="page-card areaclient-card">
      <h2>Área do Cliente</h2>
      <p>Bem-vindo à área do cliente. Aqui você pode ver suas informações, pedidos e suporte.</p>
      <div className="page-actions">
        <button className="back-btn" onClick={onBack}>Voltar</button>
      </div>
    </div>
  );
};

export default AreaClient;
