import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from '../services/api';
import { MapPin, Mail, Phone, User as UserIcon, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import defaultLogo from '../assets/logo.jpeg';

const ViewDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await getUser(id);
                setUser(data);
            } catch (error) {
                toast.error('Failed to fetch user details');
            }
        };
        fetchUser();
    }, [id]);

    if (!user) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <button className="btn" onClick={() => navigate('/')} style={{ marginBottom: '1.5rem', background: '#ddd' }}>
                <ArrowLeft size={18} /> Back
            </button>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <img 
                    src={user.profileImage ? `/${user.profileImage.replace(/\\/g, '/')}` : defaultLogo} 
                    alt="Profile" 
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)', marginBottom: '1.5rem' }}
                />
                <h2 style={{ marginBottom: '0.5rem' }}>{`${user.firstName} ${user.lastName}`}</h2>
                <div style={{ marginBottom: '2rem' }}>
                    <span className={`badge ${user.status === 'Active' ? 'badge-active' : ''}`} style={{ background: user.status === 'Active' ? '#83272d' : '#ccc', fontSize: '1rem' }}>
                        {user.status}
                    </span>
                </div>

                <div style={{ textAlign: 'left', display: 'grid', gap: '1.2rem', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#555' }}>
                        <Mail size={20} color="#83272d" />
                        <span>{user.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#555' }}>
                        <Phone size={20} color="#83272d" />
                        <span>{user.mobile}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#555' }}>
                        <UserIcon size={20} color="#83272d" />
                        <span>{user.gender}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#555' }}>
                        <MapPin size={20} color="#83272d" />
                        <span>{user.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#555' }}>
                        <Calendar size={20} color="#83272d" />
                        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDetail;
