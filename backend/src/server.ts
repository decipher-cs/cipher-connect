import http from 'http'
import express from 'express'
import * as dotenv from 'dotenv'
import { Server } from 'socket.io'
import { initRoutes } from './routes.js'
import { initSocketIO } from './socket.js'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import expressSession from 'express-session'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import { isServerOnline } from './controllers.js'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '../../@types/socket.js'
import { Routes as routes } from '../../@types/ExpressRoutes.js'

dotenv.config()

if (!process.env.PORT || !process.env.SESSION_SECRET || !process.env.UPLOADTHING_SECRET || !process.env.DATABASE_URL)
    throw new Error('Environment variable(s) missing.')

const ONE_DAY = 1000 * 60 * 60 * 24

const PORT = process.env.PORT

const app = express()

const router = express.Router()

export const prisma = new PrismaClient()

const session = expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
    cookie: {
        maxAge: process.env.NODE_ENV === 'production' ? ONE_DAY : ONE_DAY * 5,
    },
})

const server = http.createServer(app)
export const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(server, {
    path: '/api/socket.io',
})

export const media = multer().single('upload')

app.use(session)
app.use(express.static('client/'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', router)

initRoutes(router)
initSocketIO(io)

// check if server is working by pinging this route. Route should always return 200
app.all(routes.all.healthCheck, isServerOnline)

app.get('*', (_, res) => {
    res.sendFile('frontend/dist/index.html', { root: './../' })
    //__dirname
    // res.sendFile('client/index.html', { root: '.' })
    res.sendFile('client/index.html', { root: '.' })
})
server.listen(PORT, () => console.log('Server started on port', PORT))
