// src/App.js
import React from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';

function App() {
    return (
        <div className="app">
            <h1>Welcome to Our Website</h1>
            <section className="auth-section">
                <Register />
                <br />
                <hr />
                <br />
                <Login />
            </section>
        </div>
    );
}

export default App;
