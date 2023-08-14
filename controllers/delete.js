import getConnection from '../database/connection.js';
import sql from 'mssql';
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

router.delete('/delete', async (req, res) => {
    try {
        const { fromDate, toDate, token } = req.body; // Assuming fromDate and toDate are provided in the request body

        const pool = await getConnection();

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const memberId = decodedToken.id;

        // Check if the member is an admin
        const isAdminResult = await pool.request()
            .input('memberId', sql.Int, memberId)
            .query('SELECT RoleLevel FROM Users u JOIN Roles r ON u.RoleId = r.RoleId WHERE u.UserId = @memberId');

        const isAdmin = isAdminResult.recordset[0].RoleLevel === 'Admin';

        if (!isAdmin) {
            return res.status(403).json({
                message: 'Only admins are allowed to delete feedback records.'
            });
        }

        // Delete feedback records between fromDate and toDate
        const result = await pool.request()
            .input('fromDate', sql.Date, fromDate)
            .input('toDate', sql.Date, toDate)
            .query('DELETE FROM Feedback WHERE RecordDate BETWEEN @fromDate AND @toDate');

        res.status(200).json({
            message: 'Records were successfully deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while deleting records.'
        });
    }
});

export { router as deleteRouter };