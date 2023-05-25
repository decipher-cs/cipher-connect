import { Server, Socket } from 'socket.io'
import { getUsernameFromRefreshToken } from './model.js'
import cookieParser from 'cookie-parser'
import { NextFunction } from 'express'

export const initSocketIO = (io: Server) => {
    // Check auth status
    io.use((socket, next) => {
        next()
    })

    const users: string[] = []

    io.on('connection', socket => {
        console.log('client', socket.id, 'connected')
        users.push(socket.id)
        io.emit('users', users)

        socket.on('message', (target: string, msg: string) => {
            if (target !== socket.id) {
                socket.to(target).emit('message', target, msg)
            } else throw new Error('Message cannot be sent to self')
        })

        socket.on('users list', () => {
            socket.emit('users', users)
        })

        socket.on('disconnect', () => {
            console.log('client', socket.id, 'disconnected')
            const index = users.indexOf(socket.id)
            if (index !== -1) users.splice(index)
            io.emit('users', users)
        })
    })
}
