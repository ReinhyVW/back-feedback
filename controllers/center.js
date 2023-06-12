import express from 'express';
import getConnection from '../database/connection.js';

const router = express.Router();

router.get('/center', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query('SELECT * FROM Centers;');

    const centers = result.recordset;

    res.status(200).json({ centers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

export {router as centerRouter};