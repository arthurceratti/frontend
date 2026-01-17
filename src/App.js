// src/App.js
import React, { useState } from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';
import Products from './components/pages/products';
import Clients from './components/pages/clients';
import AreaClient from './components/pages/areaclient';
import Contact from './components/pages/contact';
import logo from './assets/logo1.png';

function App() {
    const [visible, setVisible] = useState(null); // 'register' | 'login' | null

    const toggleVisible = (which) => {
        setVisible(prev => (prev === which ? null : which));
    };

    const [page, setPage] = useState(null); // 'products' | 'clients' | 'contact' | 'areaclient' | null
    const openPage = (which) => {
        setPage(which);
        setVisible(null); // close auth forms when navigating
    };

    return (
        <div className="app">
            <header className="site-header">
                <div className="brand">
                    <button type="button" className="site-logo-btn" onClick={() => { setVisible(null); setPage(null); }} aria-label="Voltar ao início" title="Voltar ao início">
                        <img src={logo} alt="Ceratti Tecnologies Solutions logo" className="site-logo" />
                    </button>
                </div>
                <div className="header-actions">
                    <button className={`auth-btn ${visible === 'register' ? 'active' : ''}`} onClick={() => toggleVisible('register')} aria-label="Abrir formulário de registro">Register</button>
                    <button className={`auth-btn secondary ${visible === 'login' ? 'active' : ''}`} onClick={() => toggleVisible('login')} aria-label="Abrir formulário de login">Login</button>
                </div>
            </header>

            <main className="container">

                {page === null ? (
                    visible === null ? (
                        <div className="hero-card">
                            <h1>Ceratti Soluções em Tecnologia</h1>
                            <p className="tagline">Leitura — Registro — Monitoramento</p>
                        </div>
                    ) : (
                        <div className="form-card">
                            <div className="form-header">
                                <h2>{visible === 'register' ? 'Create an account' : 'Welcome back'}</h2>
                            </div>
                            <section className="auth-section">
                                {visible === 'register' && <Register onBack={() => setVisible(null)} />}
                                {visible === 'login' && <Login onBack={() => setVisible(null)} />}
                            </section>
                        </div>
                    )
                ) : (
                    <div className="page-wrapper">
                        {page === 'products' && <Products onBack={() => setPage(null)} />}
                        {page === 'clients' && <Clients onBack={() => setPage(null)} />}
                        {page === 'areaclient' && <AreaClient onBack={() => setPage(null)} />}
                        {page === 'contact' && <Contact onBack={() => setPage(null)} />}
                    </div>
                )}
            </main>

            <footer className="site-footer">
                <nav className="footer-nav">
                    <button className={`footer-link ${page === 'products' ? 'active' : ''}`} onClick={() => openPage('products')}>Produtos</button>
                    <button className={`footer-link ${page === 'clients' ? 'active' : ''}`} onClick={() => openPage('clients')}>Clientes</button>
                    <button className={`footer-link ${page === 'areaclient' ? 'active' : ''}`} onClick={() => openPage('areaclient')}>Área do Cliente</button>
                    <button className={`footer-link ${page === 'contact' ? 'active' : ''}`} onClick={() => openPage('contact')}>Contato</button>
                </nav>
            </footer>
        </div>
    );
}

export default App;
