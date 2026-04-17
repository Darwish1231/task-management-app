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
            <div className="navbar-content">
                <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                    <Layers size={28} color="#3b82f6" />
                    <span>TaskHub</span>
                </Link>
                
                <div className="navbar-actions">
                    {user ? (
                        <>
                            <span>Hello, <strong>{user.username}</strong></span>
                            <button onClick={handleLogout} className="btn btn-primary" style={{ background: 'transparent', border: '1px solid var(--card-border)', padding: '0.4rem 0.8rem' }}>
                                <LogOut size={18} /> <span className="btn-text">Logout</span>
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
