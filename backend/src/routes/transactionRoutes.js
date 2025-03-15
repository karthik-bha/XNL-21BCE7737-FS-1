import express from 'express';
import {
  createTransaction,
  getAllTransactions,
  getUserTransactions,
  updateTransactionStatus
} from '../controllers/transactionController.js';

const router = express.Router();

// Create a new transaction
router.post('/', createTransaction);

// Get all transactions
router.get('/all', getAllTransactions);

// Get transactions for a user
router.get('/:id', getUserTransactions);

// Update transaction status
router.put('/:id/status', updateTransactionStatus);



export default router;
