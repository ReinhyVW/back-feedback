import getConnection from '../database/connection.js';
import sql from 'mssql';
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

router.post('/survey', async (req, res) => {
    try {
        const { answer, reason, token } = req.body;

        const pool = await getConnection();

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const memberId = decodedToken.id;

        const result = await pool.request()
            //.input('date', sql.Date, '2022/01/02')
            .input('answer', sql.Int, answer)
            .input('reason', sql.Int, reason)
            .input('memberId', sql.Int, memberId)
            .query('INSERT INTO Feedback (AnswerId, ReasonId, UserId) VALUES (@answer, @reason, @memberId)');

        res.status(200).json({
            message: 'Record was successfully added'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while saving the answer.'
        });
    }
});

export default router;