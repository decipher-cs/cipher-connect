import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { initSocketIO } from './socket.js'

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || process.env.DEV_PORT
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } })

dotenv.config()
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

initSocketIO(io)

server.listen(PORT, () => console.log('Server started on port', PORT))
