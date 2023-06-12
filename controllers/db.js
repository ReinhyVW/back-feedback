import express from 'express';
import getConnection from '../database/connection.js';

const router = express.Router();

router.get('/db', async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query('SELECT * FROM Feedback;');

        const feedback = result.recordset;

        res.status(200).json({ feedback });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

export default router;