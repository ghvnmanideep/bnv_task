import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser, getUser } from '../services/api';
import { toast } from 'react-toastify';
import defaultLogo from '../assets/logo.jpeg';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        gender: 'Male',
        status: 'Active',
        location: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchUser = async () => {
                try {
                    const { data } = await getUser(id);
                    setFormData({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        mobile: data.mobile,
                        gender: data.gender,
                        status: data.status,
                        location: data.location
                    });
                    if (data.profileImage) {
                        setPreview(`/${data.profileImage.replace(/\\/g, '/')}`);
                    }
                } catch (error) {
                    toast.error('Failed to fetch user details');
                }
            };
            fetchUser();
        }
    }, [id, isEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile || !formData.location) {
            toast.error('Please fill all required fields');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Invalid email format');
            return false;
        }
        if (formData.mobile.length < 10) {
            toast.error('Mobile number should be at least 10 digits');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (profileImage) data.append('profileImage', profileImage);

        try {
            if (isEdit) {
                await updateUser(id, data);
                toast.success('User updated successfully');
            } else {
                await createUser(data);
                toast.success('User registered successfully');
            }
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                {isEdit ? 'Update Your Details' : 'Register Your Details'}
            </h2>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                            src={preview || defaultLogo} 
                            alt="Preview" 
                            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }}
                        />
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>First name</label>
                            <input type="text" name="firstName" className="form-control" placeholder="Enter FirstName" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" className="form-control" placeholder="Enter LastName" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" name="email" className="form-control" placeholder="Enter Email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Mobile</label>
                            <input type="text" name="mobile" className="form-control" placeholder="Enter Mobile" value={formData.mobile} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Select Your Gender</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <label style={{ fontWeight: 'normal' }}>
                                    <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleInputChange} /> Male
                                </label>
                                <label style={{ fontWeight: 'normal' }}>
                                    <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleInputChange} /> Female
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Select Your Status</label>
                            <select name="status" className="form-control" value={formData.status} onChange={handleInputChange}>
                                <option value="Active">Active</option>
                                <option value="InActive">InActive</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Select Your Profile</label>
                            <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                        </div>
                        <div className="form-group">
                            <label>Enter Your Location</label>
                            <input type="text" name="location" className="form-control" placeholder="Enter Your Location" value={formData.location} onChange={handleInputChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
