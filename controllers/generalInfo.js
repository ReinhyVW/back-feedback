import express from 'express'
import moment from 'moment'
import getConnection from '../database/connection.js'

const router = express.Router();

router.get('/generalInfo', async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT * FROM feedback
        `);



        res.status(200).json({ generalInfo });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;