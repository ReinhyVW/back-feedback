import express from 'express';
import getConnection from '../database/connection.js';
import sql from 'mssql';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/centers', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT * FROM Centers`);

    const centers = result.recordset;

    res.status(200).json({ centers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

router.post('/centersadd', async (req, res) => {
  try {
    const { facilityName, locationAddress, contactName, contactPhone, token } = req.body;

    const pool = await getConnection();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const memberId = decodedToken.id;

    const result = await pool.request()
      .input('facilityName', sql.VarChar, facilityName)
      .input('locationAddress', sql.VarChar, locationAddress)
      .input('contactName', sql.VarChar, contactName)
      .input('contactPhone', sql.VarChar, contactPhone)
      .query('INSERT INTO Centers (FacilityName, LocationAddress, ContactName, ContactPhone) VALUES (@facilityName, @locationAddress, @contactName, @contactPhone)');

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

router.post('/centersedit', async (req, res) => {
  try {
    const { centerId, facilityName, locationAddress, contactName, contactPhone, token } = req.body;

    const pool = await getConnection();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.request()
      .input('centerId', sql.VarChar, centerId)
      .input('facilityName', sql.VarChar, facilityName)
      .input('locationAddress', sql.VarChar, locationAddress)
      .input('contactName', sql.VarChar, contactName)
      .input('contactPhone', sql.VarChar, contactPhone)
      .query(`UPDATE Centers 
        SET FacilityName = @facilityName, LocationAddress = @locationAddress, 
        ContactName = @contactName, ContactPhone = @contactPhone 
        WHERE CenterId = @centerId
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

router.delete('/centerdelete', async (req, res) => {
  try {
    const centerId = req.body.centerId; // Assuming the request body contains the centerId

    const pool = await getConnection();

    const result = await pool
      .request()
      .input('centerId', sql.VarChar, centerId)
      .query('DELETE FROM Centers WHERE CenterId = @centerId');

    res.status(200).json({
      message: 'Record was successfully deleted',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'An error occurred while deleting the center record.',
    });
  }
});


export { router as centersRouter };