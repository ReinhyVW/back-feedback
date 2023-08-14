import express from 'express'
import config from './config/config.js'

import { authRouter } from './controllers/auth.js'
import { surveyRouter } from './controllers/survey.js'
import { centerRouter } from './controllers/center.js'
import { informationRouter } from './controllers/information.js'
import { userRouter } from './controllers/user.js'
import { centersRouter } from './controllers/centers.js'
import { rolesRouter } from './controllers/roles.js'
import { deleteRouter } from './controllers/delete.js'
import { exportRouter } from './controllers/export.js'

import cors from 'cors';

const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', authRouter)
app.use('/', surveyRouter)
app.use('/', centerRouter)
app.use('/', informationRouter)
app.use('/', userRouter)
app.use('/', centersRouter)
app.use('/', rolesRouter)
app.use('/', deleteRouter)
app.use('/', exportRouter)

app.set('port', config.port)


app.listen(app.get('port'), () => {
    console.log("Server is running on port", app.get('port'))
});