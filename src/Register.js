// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';


const Register = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("React App Backend URL:", process.env.REACT_APP_BACKEND_URL);
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, { email, password }, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
            alert('Registration successful!');
            console.log("User registered:", email);
            // Optionally redirect to the login page or home page
        } catch (error) {
            console.error(error);
            alert('Failed to register. Please check your details.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <br />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br />
                <button type="submit">Register</button>
                <button type="button" className="back-btn" onClick={onBack}>Back</button>
            </form>
        </div>
    );
};

export default Register;