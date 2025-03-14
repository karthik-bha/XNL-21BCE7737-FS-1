import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import { server } from '../server.js';

describe('Transaction API Tests', () => {
    let sender, receiver;

    beforeAll(async () => {
        await connectDB();
        sender = await User.create({ name: 'Sender', email: 'sender@example.com', password: 'password123', balance: 1200 });
        receiver = await User.create({ name: 'Receiver', email: 'receiver@example.com', password: 'password123', balance: 1500 });
    });

    afterAll(async () => {
        await Transaction.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
        // server.close();
    });

    test('Should successfully create a transfer transaction', async () => {
        const res = await request(app).post('/api/transactions').send({
            sender: sender._id,
            receiver: receiver._id,
            amount: 100,
            transactionType: 'transfer'
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('completed');
    });

    test('Should successfully create a deposit transaction (self-deposit)', async () => {
        const res = await request(app).post('/api/transactions').send({
            sender: sender._id,
            receiver: sender._id, // Sender is not required for deposits
            amount: 200,
            transactionType: 'deposit'
        });
        console.log(res);
        expect(res.statusCode).toBe(201);
        expect(res.body.transactionType).toBe('deposit');
    });

    test('Should fail deposit transaction if depositing to another user', async () => {
        const res = await request(app).post('/api/transactions').send({
            sender: sender._id,
            receiver: receiver._id, // Deposits should only be to the same account
            amount: 100,
            transactionType: 'deposit'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("You can only deposit into your own account");
    });

    test('Should fail deposit transaction if amount is zero', async () => {
        const res = await request(app).post('/api/transactions').send({
            sender: sender._id,
            receiver: sender._id,
            amount: 0,
            transactionType: 'deposit'
        });
        expect(res.statusCode).toBe(400);
    });

    test('Should successfully create a withdrawal transaction if balance allows', async () => {
        // Ensure sender has enough balance before testing
        await User.findByIdAndUpdate(sender._id);

        const res = await request(app).post('/api/transactions').send({
            sender: sender._id,
            receiver: sender._id,
            amount: 50,
            transactionType: 'withdrawal'
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.transactionType).toBe('withdrawal');
        expect(res.body.status).toBe('completed'); // Ensure status is correct
    });

    test('Should fail withdrawal if insufficient balance', async () => {
        await User.findByIdAndUpdate(sender._id, {balance:10}); // Set balance low intentionally

        const res = await request(app).post('/api/transactions').send({
            sender: sender._id,
            receiver:sender._id,
            amount: 100, // More than available balance
            transactionType: 'withdrawal'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Insufficient balance');
    });

    test('Should fail transaction if amount is negative', async () => {
        const res = await request(app).post('/api/transactions').send({
            sender: sender._id,
            receiver: receiver._id,
            amount: -50,
            transactionType: 'transfer'
        });
        expect(res.statusCode).toBe(400);
    });

    test('Should fail if transaction type is invalid', async () => {
        const res = await request(app).post('/api/transactions').send({
            sender: sender._id,
            receiver: receiver._id,
            amount: 100,
            transactionType: 'invalidType'
        });
        expect(res.statusCode).toBe(400);
    });
});
