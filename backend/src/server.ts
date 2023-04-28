import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { initSocketIO } from './socket.js'
import { initRoutes } from './routes.js'

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || process.env.DEV_PORT
const io = new Server(server, { cors: { origin: process.env.ORIGIN_DEV_URL } })

dotenv.config()
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

initRoutes(app)
initSocketIO(io)

server.listen(PORT, () => console.log('Server started on port', PORT))
