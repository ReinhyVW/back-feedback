import getConnection from '../database/connection.js';
import sql from 'mssql'
import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

function generateToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '365d'
  });
  return token;
}

const router = express.Router();

router.post('/auth', async (req, res) => {
  const { username, password } = req.body;

  const pool = await getConnection();

  try {
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');

    if (result.recordset.length === 0) {
      return res.status(401).send('User not found');
    }

    const results = result.recordset[0]

    const storedPassword = results.Passcode;
    const storedRole = results.RoleId

    let redirectUrl = ''

    storedRole === 3 ? redirectUrl = 'survey' : redirectUrl = 'portal'

    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect Password' });
    }

    const token = generateToken({ id: result.recordset[0].UserId });
    res.status(200).json({ token, redirectUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export {router as authRouter};