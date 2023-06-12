import express from 'express';
import getConnection from '../database/connection.js';

const router = express.Router();

router.get('/roles', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`SELECT * FROM Roles`);

    const roles = result.recordset;

    res.status(200).json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

export { router as rolesRouter };