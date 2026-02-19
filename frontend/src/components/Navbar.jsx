import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Home, UserPlus } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav style={{
            background: '#fff',
            padding: '1rem 2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <Link to="/" style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#83272d', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <div style={{ background: '#83272d', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>BNV</div>
                <span>Portal</span>
            </Link>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Link to="/" style={{ 
                    textDecoration: 'none', 
                    color: location.pathname === '/' ? '#83272d' : '#666',
                    fontWeight: location.pathname === '/' ? 'bold' : 'normal',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                }}>
                    <Home size={18} /> Home
                </Link>
                <Link to="/users" style={{ 
                    textDecoration: 'none', 
                    color: location.pathname === '/users' ? '#83272d' : '#666',
                    fontWeight: location.pathname === '/users' ? 'bold' : 'normal',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                }}>
                    <Users size={18} /> User List
                </Link>
                <Link to="/add" style={{ 
                    textDecoration: 'none', 
                    color: location.pathname === '/add' ? '#83272d' : '#666',
                    fontWeight: location.pathname === '/add' ? 'bold' : 'normal',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                }}>
                    <UserPlus size={18} /> Add User
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
