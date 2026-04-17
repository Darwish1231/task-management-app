import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Layers } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass-panel-static">
            <div style={{ padding: '0 1.5rem', display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                    <Layers size={28} color="#3b82f6" />
                    TaskHub
                </Link>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <span style={{ color: 'var(--text-secondary)' }}>Hello, <strong>{user.username}</strong></span>
                            <button onClick={handleLogout} className="btn btn-primary" style={{ background: 'transparent', border: '1px solid var(--card-border)', padding: '0.4rem 1rem' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
