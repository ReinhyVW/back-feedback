import express from 'express';
import getConnection from '../database/connection.js';
import sql from 'mssql';
import jwt from 'jsonwebtoken';
import generatePassword from '../domain/encrypt.js';

const router = express.Router();

router.get('/user', async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
      SELECT u.UserId, u.Username, u.Passcode, u.PasswordReset, u.MemberName, u.MemberLname, u.CreationDate,
       c.FacilityName, r.RoleLevel
      FROM Users u
      JOIN Centers c ON u.CenterId = c.CenterId
      JOIN Roles r ON u.RoleId = r.RoleId;
    `);

        const users = result.recordset;

        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

router.post('/useradd', async (req, res) => {
    try {
        const { username, passcode, memberName, memberLName, roleId, centerId, token } = req.body;

        const password = await generatePassword(passcode);

        const pool = await getConnection();

        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('passcode', sql.VarChar, password)
            .input('memberName', sql.VarChar, memberName)
            .input('memberLName', sql.VarChar, memberLName)
            .input('roleId', sql.VarChar, roleId)
            .input('centerId', sql.VarChar, centerId)
            .query('INSERT INTO Users (Username, Passcode, MemberName, MemberLname, RoleId, CenterId) VALUES (@username, @passcode, @memberName, @memberLName, @roleId, @centerId)');

        res.status(200).json({
            message: 'Record was successfully added'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while saving the User.'
        });
    }
});


router.post('/useredit', async (req, res) => {
    try {
        const { userId, username, passcode, memberName, memberLName, roleId, centerId } = req.body;

        const pool = await getConnection();

        const result = await pool.request()
            .input('userId', sql.VarChar, userId)
            .input('username', sql.VarChar, username)
            .input('passcode', sql.VarChar, passcode)
            .input('memberName', sql.VarChar, memberName)
            .input('memberLName', sql.VarChar, memberLName)
            .input('roleId', sql.VarChar, roleId)
            .input('centerId', sql.VarChar, centerId)

            .query(`UPDATE Users 
        SET Username = @username, Passcode = @passcode, 
        MemberName = @membername, MemberLname = @memberLName, 
        RoleId = @roleId, CenterId = @centerId 
        WHERE UserId = @userId
      `);

        res.status(200).json({
            message: 'Record was successfully updated'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while updating the user record.'
        });
    }
});

router.delete('/userdelete', async (req, res) => {
    try {
        const userId = req.body.userId;

        const pool = await getConnection();

        const result = await pool
            .request()
            .input('userId', sql.VarChar, userId)
            .query('DELETE FROM Users WHERE UserId = @userId');

        res.status(200).json({
            message: 'Record was successfully deleted',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while deleting the user record.',
        });
    }
});

export { router as userRouter };