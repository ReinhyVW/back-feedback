import express from 'express'
import moment from 'moment'
import getConnection from '../database/connection.js'

const router = express.Router();

router.get('/information', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        F.RecordDate AS Feedback_Date,
        C.FacilityName AS Center,
        SUM(CASE WHEN A.OptionName = 'Excellent' THEN 1 ELSE 0 END) AS Excellent,
        SUM(CASE WHEN A.OptionName = 'Good' THEN 1 ELSE 0 END) AS Good,
        SUM(CASE WHEN A.OptionName = 'Poor' THEN 1 ELSE 0 END) AS Poor,
        STUFF((
          SELECT
            ', ' + CAST(COUNT(*) AS VARCHAR) + ' - ' + R.ReasonName
          FROM
            Feedback F2
            INNER JOIN Answers A2 ON F2.AnswerId = A2.AnswerId
            INNER JOIN Reasons R ON F2.ReasonId = R.ReasonId
            INNER JOIN Users U ON F2.UserId = U.UserId
            INNER JOIN Centers C2 ON U.CenterId = C2.CenterId
          WHERE
            F2.RecordDate = F.RecordDate
            AND A2.OptionName = 'Excellent'
            AND C.CenterId = C2.CenterId
          GROUP BY
            R.ReasonName
          ORDER BY
            COUNT(*) DESC
          FOR XML PATH('')
        ), 1, 2, '') AS excellentReason,
        STUFF((
          SELECT
            ', ' + CAST(COUNT(*) AS VARCHAR) + ' - ' + R.ReasonName
          FROM
            Feedback F2
            INNER JOIN Answers A2 ON F2.AnswerId = A2.AnswerId
            INNER JOIN Reasons R ON F2.ReasonId = R.ReasonId
            INNER JOIN Users U ON F2.UserId = U.UserId
            INNER JOIN Centers C2 ON U.CenterId = C2.CenterId
          WHERE
            F2.RecordDate = F.RecordDate
            AND A2.OptionName = 'Poor'
            AND C.CenterId = C2.CenterId
          GROUP BY
            R.ReasonName
          ORDER BY
            COUNT(*) DESC
          FOR XML PATH('')
        ), 1, 2, '') AS poorReason,
        STUFF((
          SELECT
            ', ' + CAST(COUNT(*) AS VARCHAR) + ' - ' + R.ReasonName
          FROM
            Feedback F2
            INNER JOIN Answers A2 ON F2.AnswerId = A2.AnswerId
            INNER JOIN Reasons R ON F2.ReasonId = R.ReasonId
            INNER JOIN Users U ON F2.UserId = U.UserId
            INNER JOIN Centers C2 ON U.CenterId = C2.CenterId
          WHERE
            F2.RecordDate = F.RecordDate
            AND A2.OptionName = 'Good'
            AND C.CenterId = C2.CenterId
          GROUP BY
            R.ReasonName
          ORDER BY
            COUNT(*) DESC
          FOR XML PATH('')
        ), 1, 2, '') AS goodReason
      FROM
        Feedback F
        INNER JOIN Answers A ON F.AnswerId = A.AnswerId
        INNER JOIN Users U ON F.UserId = U.UserId
        INNER JOIN Centers C ON U.CenterId = C.CenterId
      GROUP BY
        F.RecordDate,
        C.FacilityName,
        C.CenterId;
    `);

    function parseReasons(reasons) {
      if (!reasons) {
        return [];
      }

      const parsedReasons = {};
      reasons.split(',').forEach((reason) => {
        const [count, name] = reason.trim().split(' - ');
        parsedReasons[name] = parseInt(count);
      });

      return parsedReasons;
    }

    const feedback = result.recordset.reduce((acc, item) => {
      const feedbackDate = moment(item.Feedback_Date).add(1, 'day').format('YYYY/MM/DD');
      if (!acc[feedbackDate]) {
        acc[feedbackDate] = [];
      }

      let formattedRecord = {
        Center: item.Center,
        Excellent: item.Excellent,
        Good: item.Good,
        Poor: item.Poor,
        excellentReason: item.excellentReason !== null ? parseReasons(item.excellentReason) : [],
        goodReason: item.goodReason !== null ? parseReasons(item.goodReason) : [],
        poorReason: item.poorReason !== null ? parseReasons(item.poorReason) : [],
      };

      acc[feedbackDate].push(formattedRecord);

      return acc;
    }, {});



    res.status(200).json({ feedback });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

export {router as informationRouter}