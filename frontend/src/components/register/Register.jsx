import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data ={ name, email, password, role }
        // console.log(data)
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, data );
            alert('Registration successful!');
            navigate('/login');
        } catch (error) {
            alert('Registration failed!');
        }finally{
            setLoading(false);
        }
    };

    if(loading) return <Loader/>

    return (
        <div className='parent-container'>
            <div className='secondary-container'>
                <h2 className='text-center text-2xl my-4'>Register</h2>
                <form onSubmit={handleSubmit} className='form-container'>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <select value={role} className="bg-[#1d1d41] " onChange={(e) => setRole(e.target.value)}>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="advisor">Advisor</option>
                    </select>
                    <button type="submit" className='btn-primary'>Register</button>
                </form>
                <p>Already registered? <Link to="/login" className='text-blue-500'>Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
