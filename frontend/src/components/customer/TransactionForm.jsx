// TransactionForm.js
import React, { useState, useEffect } from 'react';

const TransactionForm = ({ userId, users, handleTransactionSubmit, transactionType, setTransactionType, receiver, setReceiver, amount, setAmount }) => {

  return (
    <>
      <h3 className="text-2xl font-medium text-gray-800 mb-4">Make a Transaction</h3>
      <form onSubmit={handleTransactionSubmit} className="space-y-6">
        <div>
          <label htmlFor="transactionType" className="block text-lg font-medium text-gray-700">Transaction Type</label>
          <select
            id="transactionType"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        {transactionType !== 'deposit' && transactionType !== 'withdrawal' && (
          <div>
            <label htmlFor="receiver" className="block text-lg font-medium text-gray-700">Receiver</label>
            <select
              id="receiver"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              required
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Receiver</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="amount" className="block text-lg font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Make Transaction
        </button>
      </form>
    </>
  );
};

export default TransactionForm;
