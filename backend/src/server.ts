import http from 'http'
import express from 'express'
import * as dotenv from 'dotenv'
import { Server } from 'socket.io'
import { initRoutes } from './routes.js'
import { initSocketIO } from './socket.js'
import { corsWithOptions } from './config/corsOptions.js'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import expressSession from 'express-session'

dotenv.config()

if (
    !process.env.PORT ||
    !process.env.CLIENT_URL ||
    !process.env.SESSION_SECRET ||
    !process.env.UPLOADTHING_SECRET ||
    !process.env.UPLOADTHING_APP_ID
)
    throw new Error('Environment variables are not setup.')

const ONE_DAY = 1000 * 60 * 60 * 24
const PORT = process.env.PORT
const app = express()
const session = expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: process.env.NODE_ENV === 'production' ? { maxAge: ONE_DAY, secure: true } : { maxAge: 1000 * 60 * 1 },
})

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin:
            process.env.NODE_ENV === 'production'
                ? [process.env.CLIENT_URL]
                : [process.env.CLIENT_URL, 'http://localhost:4173'],
    },
})

export const prisma = new PrismaClient()

export const media = multer().single('upload')

// if (app.settings.env === 'production') app.use(reqLogger) // only run this code if app is running in production.
// app.use(isAuth)
app.use(session)
app.use(corsWithOptions())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

initRoutes(app)
initSocketIO(io)

server.listen(PORT, () => console.log('Server started on port', PORT))
