import React from 'react'
import TransactionUpdates from './TransactionUpdates';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className='parent-container'>
      <div className='secondary-container'>
        <h2 className='my-6 text-2xl font-bold'>Customer Dashboard </h2>
        <button
          onClick={handleLogout}
          className="cursor-pointer py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 mb-4"
        >
          Logout
        </button>
        <TransactionUpdates />
      </div>

    </div>
  )
}

export default CustomerDashboard;