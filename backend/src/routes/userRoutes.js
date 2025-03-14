import express from 'express';
import { getCustomers } from '../controllers/userController.js'; 

const router = express.Router();

// Route to fetch users with 'customer' role
router.get('/', getCustomers);

export default router;
