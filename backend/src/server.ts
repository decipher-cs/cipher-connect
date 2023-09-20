import http from 'http'
import express from 'express'
import * as dotenv from 'dotenv'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import { initRoutes } from './routes.js'
import { initSocketIO } from './socket.js'
import { reqLogger } from './middleware/logs.js'
import { corsWithOptions } from './config/corsOptions.js'
import multer from 'multer'

dotenv.config()

const PORT = process.env.PORT || process.env.DEV_PORT
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: process.env.ORIGIN_DEV_URL },
    maxHttpBufferSize: 1e8,
    pingTimeout: 600000,
})

export const media = multer({ dest: 'public/media' }).single('userUpload')
export const avatar = multer({ dest: 'public/avatars' }).single('avatar')

// middleware //
if (app.settings.env === 'production') app.use(reqLogger) // only run this code if app is running in production.

app.use(express.static('public/'))
app.use(corsWithOptions())
app.use(cookieParser())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

initRoutes(app)
initSocketIO(io)

server.listen(PORT, () => console.log('Server started on port', PORT))
