import React from 'react';
import axios from 'axios';
import './logout.css';

const Logout = ({ onBack }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`);
            // Clear the token and redirect to login page
            localStorage.removeItem('token');
            alert('Logout successful!');
            window.location.href = '/login'; // Redirect back to the login page
        } catch (error) {
            console.error(error);
            alert('Failed to logout. Please try again.');
        }
    };

    return (
        <div className="logout-container">
            <h2>Logout</h2>
            <form onSubmit={handleSubmit}>
                <button type="submit">Logout</button>
                 <button type="button" className="back-btn" onClick={onBack}>Back</button>
            </form>
        </div>
    );
};

export default Logout;