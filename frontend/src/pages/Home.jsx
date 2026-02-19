import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, ArrowRight, Shield, Globe, Zap } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#f8f9fa', minHeight: 'calc(100vh - 70px)' }}>
            {/* Hero Section */}
            <header style={{ 
                padding: '5rem 2rem', 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #83272d 0%, #2b3990 100%)',
                color: '#fff'
            }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '800' }}>
                    Streamline Your User Management
                </h1>
                <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '800px', margin: '0 auto 2.5rem', opacity: 0.9 }}>
                    A powerful and intuitive platform to manage, track, and export your user data with ease. 
                    Built with the modern MERN stack for speed and reliability.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button 
                        onClick={() => navigate('/users')}
                        className="btn"
                        style={{ 
                            background: '#fff', 
                            color: '#83272d', 
                            padding: '1rem 2rem', 
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}
                    >
                        View User Directory <ArrowRight size={20} />
                    </button>
                    <button 
                        onClick={() => navigate('/add')}
                        className="btn"
                        style={{ 
                            background: 'transparent', 
                            color: '#fff', 
                            padding: '1rem 2rem', 
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderRadius: '8px',
                            border: '2px solid #fff',
                            cursor: 'pointer'
                        }}
                    >
                        <UserPlus size={20} /> Register New User
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.3s ease' }}>
                        <div style={{ background: '#83272d20', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Shield color="#83272d" size={30} />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Secure & Reliable</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Advanced security protocols to ensure your user data is protected and always available when you need it.
                        </p>
                    </div>

                    <div className="card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.3s ease' }}>
                        <div style={{ background: '#2b399020', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Zap color="#2b3990" size={30} />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Lightning Fast</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Optimized database queries and efficient frontend rendering for a smooth user experience.
                        </p>
                    </div>

                    <div className="card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.3s ease' }}>
                        <div style={{ background: '#83272d20', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Globe color="#83272d" size={30} />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Global Access</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Manage your users from anywhere in the world with our cloud-hosted infrastructure.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid #ddd', color: '#666' }}>
                <p>© 2026 BNV User Management Portal. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
