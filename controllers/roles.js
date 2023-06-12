import express from 'express';
import getConnection from '../database/connection.js';
import sql from 'mssql';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const rolesRouter = express.Router();

rolesRouter.get('/roles', async (req, res) => {
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

export default rolesRouter;