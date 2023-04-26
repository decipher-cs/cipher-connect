import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

import { Prisma, PrismaClient, users } from '@prisma/client'
const prisma = new PrismaClient()

import cors from 'cors'
app.use(cors())

import http from 'http'
const server = http.createServer(app)

import { Server } from 'socket.io'
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } })

import jwt from 'jsonwebtoken'

const PORT = process.env.PORT || 3000

app.get('/', (_, res) => {
    res.send('we are done here!')
})

const createNewUser = async (username: string, salt: string) => {
    const returnedData = await prisma.users.create({
        data: {
            username,
            password_hash: crypto.randomUUID().toString().slice(10),
            salt,
        },
    })
    return returnedData
}

app.post('/login', (req, res, next) => {
    const user = { name: 'holler' }
    // res.json({ requestBody: req.body})
    console.log('req body', req.body)
    // jwt.sign(user, process.env.SECRET)
    createNewUser('foo', 'bar')
    res.send('we are done here!')
})

io.on('connection', socket => {
    socket.on('connection', () => {
        console.log('found user with id', socket.id)
    })

    socket.on('message', msg => {
        console.log(msg, '<----')
        socket.broadcast.emit('message', msg)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

server.listen(PORT, () => console.log(`http://localhost:${PORT}`))
