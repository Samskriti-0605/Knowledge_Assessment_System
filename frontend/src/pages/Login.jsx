import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 className="text-center mb-4">Welcome Back</h2>
                {error && <div className="p-3 mb-3" style={{ background: 'var(--secondary)', color: 'white', borderRadius: '0.5rem' }}>{error}</div>}
                <div style={{ padding: '10px', background: 'var(--background)', textAlign: 'center', marginBottom: '10px', fontSize: '0.8rem', borderRadius: '0.5rem' }}>
                    <button onClick={() => import('../utils/diagnostics').then(mod => mod.default())} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                        Run Connection Test (Use if Login Fails)
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" style={{ width: '100%' }}>Login</button>
                    <p className="mt-4 text-center">
                        Don't have an account? <span onClick={() => navigate('/register')} style={{ color: 'var(--primary)', cursor: 'pointer' }}>Register</span>
                    </p>
                </form>
                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem', opacity: 0.5 }}>
                    System V2.0 - Production Ready<br />
                    Connected to Render Cloud Securely
                </div>
            </div>
        </div>
    );
};

export default Login;
