import express from 'express';
import { 
  createTransaction, 
  getUserTransactions, 
  updateTransactionStatus 
} from '../controllers/transactionController.js';

const router = express.Router();

// Create a new transaction
router.post('/', createTransaction);

// Get transactions for a user
router.get('/:id', getUserTransactions);

// Update transaction status
router.put('/:id/status', updateTransactionStatus);

export default router;
