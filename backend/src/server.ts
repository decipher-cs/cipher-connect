import http from 'http'
import express, { NextFunction, Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import { initRoutes } from './routes.js'
import { initSocketIO } from './socket.js'
import { reqLogger } from './middleware/logs.js'
import { corsWithOptions } from './config/corsOptions.js'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import expressSession, { Session } from 'express-session'

dotenv.config()

const PORT = process.env.PORT
const app = express()
const session = expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true })
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

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    next('route')
}

export const media = multer().single('upload')

// if (app.settings.env === 'production') app.use(reqLogger) // only run this code if app is running in production.
app.use(session)
app.use(isAuth)
app.use(corsWithOptions())
app.use(cookieParser())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

initRoutes(app)
initSocketIO(io)

server.listen(PORT, () => console.log('Server started on port', PORT))
