import express from 'express';
import getConnection from '../database/connection.js';
import sql from 'mssql';

const router = express.Router();

router.get('/export', async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;  // Use req.query for query parameters
        
        const pool = await getConnection();

        const result = await pool.request()
            .input('fromDate', sql.Date, fromDate)
            .input('toDate', sql.Date, toDate)
            .query('SELECT * FROM Feedback WHERE RecordDate BETWEEN @fromDate AND @toDate');

        const download = result.recordset;

        res.status(200).json({ download });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

export { router as exportRouter };