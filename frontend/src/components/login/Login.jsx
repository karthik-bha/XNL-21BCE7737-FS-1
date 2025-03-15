import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setMessage('Login successful!');
      const role = response.data.user.role;
      
      if (role === 'admin') {
        navigate('/admin/dashboard'); // admin dashboard
      } else if (role === 'customer') {
        navigate('/customer/dashboard'); // customer dashboard
      } else if (role === 'advisor') {
        navigate('/advisor/dashboard'); // advisor dashboard
      }
    } catch (error) {
      console.error(error); 
      setMessage(error.response?.data?.message || 'Something went wrong!');
    }finally{
      setLoading(false);
    }
  };

  if(loading) return <Loader/>

  
  return (
    <div className="parent-container">
      <div className='secondary-container '>
        <h2 className='text-center text-2xl my-4'>Login</h2>
        <form onSubmit={handleSubmit} className='form-container'>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Email'
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='password'
            />
          </div>
          <button type="submit" className='btn-primary'>Login</button>
        </form>
        {message && <p>{message}</p>}
        <p>Not registered? <Link to="/register" className='text-blue-500'>Register</Link></p>
      </div>
    
    </div>
  );
};

export default Login;
