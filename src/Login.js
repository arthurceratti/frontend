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
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { email, password });
            alert('Login successful!'); 
        } catch (error) {
            console.error(error);
            alert('Failed to login. Please check your details.');
        }
    };

    // Store the token in local storage upon successful login
    localStorage.setItem('token', response.data.token);

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