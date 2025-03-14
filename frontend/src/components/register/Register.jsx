import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data ={ name, email, password, role }
        console.log(data)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, data );
            alert('Registration successful!');
            navigate('/login');
        } catch (error) {
            alert('Registration failed!');
        }
    };

    return (
        <div className='h-[100vh] w-[100vw] flex'>
            <div className='m-auto flex flex-col gap-4'>
                <h2 className='text-center text-2xl'>Register</h2>
                <form onSubmit={handleSubmit} className='form-container'>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="advisor">Advisor</option>
                    </select>
                    <button type="submit" className='btn-primary'>Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
