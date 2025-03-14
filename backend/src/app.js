import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectDB();

app.use('/api/auth', authRoutes);
app.use ('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes); 

app.get('/', (req, res) => res.send('API is running...'));

export default app;
