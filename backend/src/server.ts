import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()

// import pkg from 'express-openid-connect'
// const { auth, requiresAuth } = pkg

import cors from 'cors'
app.use(cors())

import http from 'http'
const server = http.createServer()

import { Server } from 'socket.io'
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } })
// const io = new Server(server, { cors: { origin: '*' } })

const PORT = process.env.PORT || 3000

// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: 'a long, randomly-generated string stored in env',
//     baseURL: 'http://localhost:3000',
//     clientID: 'zCdZzfJFtKJ1dgM4DfUcJ51OcjlxqgTk',
//     issuerBaseURL: 'https://dev-uronr1qqy3iuo8ek.us.auth0.com',
// }

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config))

// req.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//     res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
// })

// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user))
// })

app.get('/', (_, res) => res.json({ msg: 'hello world' }))

io.on('connection', socket => {
  socket.on('connection', ()=>{
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
app.listen(8080, () => console.log(`http://localhost:${8080}`))
