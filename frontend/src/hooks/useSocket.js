import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; 

const useSocket = () => {
  const [transactions, setTransactions] = useState([]);
  console.log(transactions);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("transaction_update", (transaction) => {
      setTransactions((prev) => [transaction, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return transactions;
};

export default useSocket;
