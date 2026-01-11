// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';


const Login = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { email, password }, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
            console.log(response.data);
            // Handle the token and possibly store it in local storage
            alert('Login successful!');
            // Optionally redirect to a protected page or home page
        } catch (error) {
            console.error(error);
            alert('Failed to login. Please check your details.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <br />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br />
                <button type="submit">Login</button>
                <button type="button" className="back-btn" onClick={onBack}>Back</button>
            </form>
        </div>
    );
};

export default Login;