import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import TransactionList from './customer/TransactionList';
import TransactionForm from './customer/TransactionForm';
import Loader from './Loader';

const TransactionUpdates = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('transfer');
  const [receiver, setReceiver] = useState('');
  const [users, setUsers] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'); // Server URL

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;


  useEffect(() => {
    if (!userId) {
      console.log('User not found.');
      return;
    }

    // Fetch initial transactions for the user
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${userId}`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.log('Error fetching transactions:', error));

    // Listen for real-time transaction updates
    socket.on('transaction_update', (newTransaction) => {
      setTransactions((prev) => [...prev, newTransaction]);
    });

    // Fetch users with the 'customer' role for the transfer case
    if (transactionType === 'transfer') {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`)
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((error) => console.log('Error fetching users:', error));
    }

    return () => socket.disconnect();
  }, [userId, transactionType]);

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
  
    if (!amount) {
      setErrorMessage('Amount is required');
      return;
    }
    setLoading(true);
  
    try {
      // Automatically set the receiver for deposit/withdrawal to the current user
      const transactionReceiver =
        transactionType === 'deposit' || transactionType === 'withdrawal'
          ? userId
          : receiver;
  
      if (transactionType === 'transfer' && !receiver) {
        setErrorMessage('Receiver is required for transfer');
        return;
      }
  
      // Create the transaction object to send to the server
      const transactionData = {
        sender: userId,
        receiver: transactionReceiver,
        amount: parseFloat(amount),
        transactionType,
      };
  
      // Submit the transaction
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
  
      const data = await response.json(); // Get the JSON response
  
      if (data.status === 200 || data.status === 201) {
        setTransactions((prev) => [...prev, data]); // Add the new transaction to the state
        setAmount('');
        setReceiver('');
        setShowTransactionForm(false); // Close the form after transaction
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('An error occurred: ' + error.message);
      console.log('Error making transaction:', error);
    } finally {
      setLoading(false); 
    }
  };
  

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4">Welcome {user.name}, These are your Transactions</h2>
      <TransactionList transactions={transactions} />

      {/* Error message display */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      {!showTransactionForm ? (
        <button
          onClick={() => setShowTransactionForm(true)}
          className="btn-primary transition duration-300"
        >
          Make a Transaction {user.name}
        </button>
      ) : (
        <TransactionForm
          userId={userId}
          users={users}
          handleTransactionSubmit={handleTransactionSubmit}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          setShowTransactionForm={setShowTransactionForm}
          receiver={receiver}
          setReceiver={setReceiver}
          amount={amount}
          setAmount={setAmount}
        />
      )}
    </div>
  );
};

export default TransactionUpdates;
