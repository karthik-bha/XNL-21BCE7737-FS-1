import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TransactionChart = ({ transactions }) => {
  // Check if transactions are available
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-6 text-lg text-gray-600">
        No transaction data available for charting.
      </div>
    );
  }

  // Prepare the chart data
  const chartData = {
    labels: transactions.map((transaction) => transaction.createdAt), // Use createdAt if available, or any other date field
    datasets: [
      {
        label: 'Transaction Amounts',
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        data: transactions.map((transaction) => transaction.amount),
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="mb-6">
      <Line data={chartData} />
    </div>
  );
};

export default TransactionChart;
