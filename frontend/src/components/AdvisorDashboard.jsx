import React from 'react'
import TransactionDisplay from './admin/TransactionDisplay'
import { useNavigate } from 'react-router-dom';

const AdvisorDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Redirect to login page
    navigate('/login');
  };
  return (
    <div className='primary-container'>
      <div className='secondary-container'>
        <h2 className='text-2xl my-12 font-bold'> Advisor dashboard</h2>
        <button
          onClick={handleLogout}
          className="cursor-pointer py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 "
        >
          Logout
        </button>
        <p className='text-lg my-6' >List of all transactions</p>
        <TransactionDisplay />
      </div>

    </div>
  )
}

export default AdvisorDashboard