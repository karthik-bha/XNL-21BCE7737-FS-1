import React from 'react';
import TransactionChart from './TransactionChart';

const TransactionList = ({ transactions }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 space-y-4">
      {/* Render the chart */}
      <TransactionChart transactions={transactions} />

      {/* Header Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="hidden md:block font-semibold text-gray-600">Sender</div>
        <div className="hidden md:block font-semibold text-gray-600">Receiver</div>
        <div className="hidden md:block font-semibold text-gray-600">Transaction Type</div>
        <div className="hidden md:block font-semibold text-gray-600">Amount</div>
      </div>

      {/* Empty state message */}
      {transactions.length === 0 ? (
        <div className="text-center py-6 text-lg text-gray-600">
          No transactions available.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => {
            // Determine the color for the transaction type
            let transactionTypeColor = '';
            if (transaction.transactionType === 'withdrawal' || transaction.transactionType === 'transfer') {
              transactionTypeColor = 'text-red-600'; // Red for withdrawal or transfer
            } else if (transaction.transactionType === 'deposit') {
              transactionTypeColor = 'text-green-600'; // Green for deposit
            }

            return (
              <div
                key={transaction._id}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center py-3 px-4 border border-gray-900"
              >
                {/* Sender */}
                <div className="flex items-center">
                  <div className="md:hidden block font-semibold text-gray-600">Sender</div>
                  <div className="ml-2">{transaction.sender ? transaction.sender.name : 'Unknown Sender'}</div>
                </div>

                {/* Receiver */}
                <div className="flex items-center">
                  <div className="md:hidden block font-semibold text-gray-600">Receiver</div>
                  <div className="ml-2">{transaction.receiver ? transaction.receiver.name : 'Unknown Receiver'}</div>
                </div>

                {/* Transaction Type */}
                <div className={`flex items-center ${transactionTypeColor}`}>
                  <div className="md:hidden block font-semibold text-gray-600">Type</div>
                  <div className="ml-2">{transaction.transactionType}</div>
                </div>

                {/* Amount */}
                <div className="flex items-center">
                  <div className="block md:hidden font-semibold text-gray-600">Amount</div>
                  <div className="ml-2">Rs.{transaction.amount}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
