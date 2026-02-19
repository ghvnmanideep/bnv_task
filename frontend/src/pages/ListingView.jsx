import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, exportCSV, updateUser } from '../services/api';
import { Search, Plus, Download, Eye, Edit, Trash2, ChevronLeft, ChevronRight, MoreVertical, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import defaultLogo from '../assets/logo.jpeg';

const ListingView = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [activeRowMenu, setActiveRowMenu] = useState(null); // { id, menuType: 'status' | 'action' }
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await getUsers({ page, search, status: statusFilter, limit: 5 });
            setUsers(data?.users || []);
            setTotalPages(data?.totalPages || 1);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, statusFilter]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveRowMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setPage(1);
            fetchUsers();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
        setActiveRowMenu(null);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const user = users.find(u => u._id === id);
            const formData = new FormData();
            formData.append('status', newStatus);
            // We only want to update status, but the API might expect more. 
            // Based on earlier inspection, updateUser takes FormData.
            await updateUser(id, formData);
            toast.success(`Status updated to ${newStatus}`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update status');
        }
        setActiveRowMenu(null);
    };

    return (
        <div className="container">
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search" 
                            style={{ width: '250px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <button className="btn btn-primary" onClick={() => { setPage(1); fetchUsers(); }}>Search</button>
                        
                        <select 
                            className="form-control" 
                            style={{ width: '150px' }} 
                            value={statusFilter} 
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="InActive">InActive</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/add')}>
                            <Plus size={18} /> Add User
                        </button>
                        <a href={exportCSV()} className="btn btn-primary" target="_blank" rel="noreferrer">
                            <Download size={18} /> Export To Csv
                        </a>
                    </div>
                </div>

                <div className="table-container">
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr style={{ background: '#212529', color: '#fff' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>FullName</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Gender</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Profile</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user, index) => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '12px' }}>{(page - 1) * 5 + index + 1}</td>
                                    <td style={{ padding: '12px' }}>{`${user.firstName} ${user.lastName}`}</td>
                                    <td style={{ padding: '12px' }}>{user.email}</td>
                                    <td style={{ padding: '12px' }}>{user.gender === 'Male' ? 'M' : 'F'}</td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <button 
                                                onClick={() => setActiveRowMenu(activeRowMenu?.id === user._id && activeRowMenu?.menuType === 'status' ? null : { id: user._id, menuType: 'status' })}
                                                style={{ 
                                                    background: user.status === 'Active' ? '#83272d' : '#6c757d', 
                                                    color: '#fff', 
                                                    border: 'none', 
                                                    padding: '4px 12px', 
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {user.status} <ChevronDown size={14} />
                                            </button>
                                            {activeRowMenu?.id === user._id && activeRowMenu?.menuType === 'status' && (
                                                <div ref={menuRef} style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    background: '#fff',
                                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                    borderRadius: '4px',
                                                    zIndex: 10,
                                                    marginTop: '4px',
                                                    minWidth: '100px',
                                                    border: '1px solid #ddd'
                                                }}>
                                                    <div onClick={() => handleStatusUpdate(user._id, 'Active')} style={{ padding: '8px 12px', cursor: 'pointer', hover: { background: '#f8f9fa' } }} className="dropdown-item">Active</div>
                                                    <div onClick={() => handleStatusUpdate(user._id, 'InActive')} style={{ padding: '8px 12px', cursor: 'pointer' }} className="dropdown-item">InActive</div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <img 
                                            src={user.profileImage ? `/${user.profileImage.replace(/\\/g, '/')}` : defaultLogo} 
                                            alt="Profile" 
                                            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <button 
                                                onClick={() => setActiveRowMenu(activeRowMenu?.id === user._id && activeRowMenu?.menuType === 'action' ? null : { id: user._id, menuType: 'action' })}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {activeRowMenu?.id === user._id && activeRowMenu?.menuType === 'action' && (
                                                <div ref={menuRef} style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: 0,
                                                    background: '#fff',
                                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                    borderRadius: '4px',
                                                    zIndex: 10,
                                                    minWidth: '120px',
                                                    border: '1px solid #ddd',
                                                    textAlign: 'left'
                                                }}>
                                                    <div onClick={() => navigate(`/view/${user._id}`)} style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#198754' }}>
                                                        <Eye size={16} /> View
                                                    </div>
                                                    <div onClick={() => navigate(`/edit/${user._id}`)} style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#0d6efd' }}>
                                                        <Edit size={16} /> Edit
                                                    </div>
                                                    <div onClick={() => handleDelete(user._id)} style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#dc3545' }}>
                                                        <Trash2 size={16} /> Delete
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.25rem' }}>
                    <button 
                        className="btn" 
                        disabled={page === 1} 
                        onClick={() => setPage(page - 1)}
                        style={{ padding: '0.4rem', border: '1px solid #ddd', background: '#fff' }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button 
                        className="btn" 
                        style={{ 
                            padding: '0.4rem 0.8rem', 
                            background: '#83272d', 
                            color: '#fff', 
                            border: '1px solid #83272d',
                            borderRadius: '4px'
                        }}
                    >
                        {page}
                    </button>
                    <button 
                        className="btn" 
                        disabled={page === totalPages} 
                        onClick={() => setPage(page + 1)}
                        style={{ padding: '0.4rem', border: '1px solid #ddd', background: '#fff' }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            <style>{`
                .dropdown-item:hover {
                    background-color: #f8f9fa;
                }
            `}</style>
        </div>
    );
};

export default ListingView;
