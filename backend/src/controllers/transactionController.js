import connectDB from '../config/db.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { broadcastTransaction } from '../server.js';

// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        await connectDB();
        const { sender, receiver, amount, transactionType } = req.body;

        if (!amount || !transactionType) {
            return res.status(400).json({ message: 'Amount and transaction type are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than zero' });
        }

        const validTypes = ['deposit', 'withdrawal', 'transfer'];
        if (!validTypes.includes(transactionType)) {
            return res.status(400).json({ message: 'Invalid transaction type' });
        }

        let senderUser = null;
        let receiverUser = null;

        // Handling Deposits (No sender required)
        if (transactionType === 'deposit') {
            if (sender && sender !== receiver) {
                return res.status(400).json({ message: "You can only deposit into your own account" });
            }

            const receiverUser = await User.findByIdAndUpdate(
                receiver,
                { $inc: { balance: amount } },
                { new: true }
            );

            if (!receiverUser) {
                return res.status(404).json({ message: 'Receiver not found' });
            }
        }

        // Handling Withdrawals
        else if (transactionType === 'withdrawal') {
            const senderUser = await User.findOneAndUpdate(
                { _id: sender, balance: { $gte: amount } }, // Ensure balance check happens atomically
                { $inc: { balance: -amount } }, // Deduct balance
                { new: true }
            );

            if (!senderUser) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }
        }


        // Handling Transfers
        else if (transactionType === 'transfer') {
            if (!sender || !receiver) {
                return res.status(400).json({ message: 'Sender and receiver are required' });
            }

            if (sender === receiver) {
                return res.status(400).json({ message: 'Sender and receiver cannot be the same' });
            }

            const senderUser = await User.findOneAndUpdate(
                { _id: sender, balance: { $gte: amount } }, // Ensure balance is sufficient
                { $inc: { balance: -amount } }, // Deduct amount
                { new: true }
            );

            if (!senderUser) {
                return res.status(400).json({ message: 'Insufficient balance or sender not found' });
            }

            const receiverUser = await User.findByIdAndUpdate(
                receiver,
                { $inc: { balance: amount } }, // Add amount
                { new: true }
            );

            if (!receiverUser) {
                // Rollback sender balance if receiver update fails
                await User.findByIdAndUpdate(sender, { $inc: { balance: amount } });
                return res.status(404).json({ message: 'Receiver not found' });
            }
        }


        // Save the transaction
        const transaction = new Transaction({
            sender,
            receiver,
            amount,
            transactionType,
            status: 'completed',
        });

        await transaction.save();

        const populatedTransaction = await Transaction.findById(transaction._id)
            .populate('sender', 'name') // Populate sender's name
            .populate('receiver', 'name'); // Populate receiver's name

        // Emit real-time event
        broadcastTransaction(populatedTransaction);

        res.status(201).json(populatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get user transactions
export const getUserTransactions = async (req, res) => {
    try {
        await connectDB();
        const userId = req.params.id;
        const transactions = await Transaction.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .populate('sender', 'name') // Populate sender's name
            .populate('receiver', 'name') // Populate receiver's name
            .sort({ createdAt: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update transaction status
export const updateTransactionStatus = async (req, res) => {
    try {
        await connectDB();
        const { status } = req.body;
        const { id } = req.params;

        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.status = status;
        await transaction.save();

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
