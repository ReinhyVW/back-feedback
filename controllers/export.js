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
            .query(`
            SELECT
                F.RecordId,
                F.RecordDate,
                F.RecordTime,
                A.OptionName AS Answer,
                R.ReasonName AS Reason,
                U.MemberName AS UserName,
                C.FacilityName AS CenterName
            FROM Feedback F
            INNER JOIN Answers A ON F.AnswerId = A.AnswerId
            INNER JOIN Reasons R ON F.ReasonId = R.ReasonId
            INNER JOIN Users U ON F.UserId = U.UserId
            INNER JOIN Centers C ON U.CenterId = C.CenterId
            WHERE F.RecordDate BETWEEN @fromDate AND @toDate
        `);

        const download = result.recordset;

        res.status(200).json({ download });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

export { router as exportRouter };