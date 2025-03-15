import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Loader from "../Loader";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const TransactionDisplay = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const socket = io(SOCKET_URL);
        
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/all`);
                const data = await res.json();
                setTransactions(data);
            } catch (err) {
                console.log("Error fetching transactions:", err);
            }finally {
                setLoading(false);
            }
        };

        fetchTransactions();

        socket.on("transaction_update", (transaction) => {
            setTransactions((prev) => [transaction, ...prev]);
        });

        return () => socket.disconnect();
    }, []);

    const getStatusColor = (type) => {
        switch (type.toLowerCase()) {
            case "deposit":
                return "text-green-600 ";
            case "withdrawal":
                return "text-red-600";
            case "transfer":
                return "text-yellow-600 ";
            default:
                return "text-gray-600 ";
        }
    };

    if(loading) return <Loader/>

    return (
        <div className=" shadow-default-shadow bg-[#1d1d41] ">
            {/* Grid Table for Medium and Larger Screens */}
            <div className="hidden md:grid grid-cols-5 gap-4 bg-gray-900 text-white p-3 rounded-t-lg text-center">
                <div className="font-semibold">Sender</div>
                <div className="font-semibold">Receiver</div>
                <div className="font-semibold">Type</div>
                <div className="font-semibold">Status</div>
                <div className="font-semibold">Amount</div>
            </div>
            <div className="hidden md:grid grid-cols-5 gap-4 items-center text-center" >
                {transactions.map((transaction) => (
                    <div key={transaction._id} className="contents border-b border-gray-300 p-3 hover:bg-gray-100">
                        <div className="p-3">{transaction.sender?.name || "Unknown"}</div>
                        <div className="p-3">{transaction.receiver?.name || "Unknown"}</div>
                        <div className={`${getStatusColor(transaction.transactionType)}`}>{transaction.transactionType}</div>
                        <div >
                            {transaction.status}
                        </div>
                        <div className="p-3 font-semibold">₹{transaction.amount}</div>
                    </div>
                ))}
            </div>

            {/* Cards for Mobile View */}
            <div className="md:hidden flex flex-col gap-4">
                {transactions.map((transaction) => (
                    <div key={transaction._id} className="items-center shadow-lg p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between mb-2">
                            <p className="text-gray-600 text-sm">Sender:</p>
                            <p className="font-semibold">{transaction.sender?.name || "Unknown"}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p className="text-gray-600 text-sm">Receiver:</p>
                            <p className="font-semibold">{transaction.receiver?.name || "Unknown"}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p className="text-gray-600 text-sm">Type:</p>
                            <p className="font-semibold capitalize">{transaction.transactionType}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p className="text-gray-600 text-sm">Status:</p>
                            <p className={`px-2 py-1 rounded-md ${getStatusColor(transaction.transactionType)}`}>
                                {transaction.status}
                            </p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600 text-sm">Amount:</p>
                            <p className="font-semibold">₹{transaction.amount}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionDisplay;
