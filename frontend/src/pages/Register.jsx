import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="glass-panel auth-form">
                <h2>Create Account</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
                
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="input-field" 
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Sign Up
                    </button>
                    
                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
