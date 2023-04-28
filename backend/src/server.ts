import http from 'http'
import express from 'express'
import * as dotenv from 'dotenv'
import { Server } from 'socket.io'
import { initSocketIO } from './socket.js'
import { initRoutes } from './routes.js'
import { reqLogger } from './middleware/logs.js'
import { corsWithOptions } from './config/corsOptions.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || process.env.DEV_PORT
const io = new Server(server, { cors: { origin: process.env.ORIGIN_DEV_URL } })

// middleware //
if (app.settings.env === 'production') app.use(reqLogger) // only run this code if app is running in production.
app.use(corsWithOptions())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

initRoutes(app)
initSocketIO(io)

server.listen(PORT, () => console.log('Server started on port', PORT))
