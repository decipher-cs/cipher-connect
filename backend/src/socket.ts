import { Server, Socket } from 'socket.io'
import { getUsernameFromRefreshToken } from './model.js'
import cookieParser from 'cookie-parser'
import { NextFunction } from 'express'

interface ServerToClientEvents {
    noArg: () => void
    basicEmit: (a: number, b: string, c: Buffer) => void
    withAck: (d: string, callback: (e: number) => void) => void
    updateUserList: (users: string[]) => void
    privateMessage: (target: string, msg: string) => void
}

// for io.on()
interface InterServerEvents {}

// for socket.on()
interface ClientToServerEvents {
    privateMessage: (target: string, msg: string) => void
    updateUserList: (users: string[]) => void
}

interface SocketData {
    username: string
}

export const initSocketIO = (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    // Check auth status
    io.use((socket, next) => {
        const username: string | undefined = socket.handshake.auth.username
        if (username === undefined) return next(new Error('Username not valid'))
        socket.data.username = username

        return next()
    })

    const users: string[] = []

    io.on('connection', socket => {
        console.log('client', socket.id, 'connected')
        users.push(socket.id)
        io.emit('updateUserList', users)

        socket.on('privateMessage', (target: string, msg: string) => {
            if (target !== socket.id) {
                socket.to(target).emit('privateMessage', target, msg)
            } else throw new Error('Message cannot be sent to self')
        })

        socket.on('updateUserList', () => {
            socket.emit('updateUserList', users)
        })

        socket.on('disconnect', () => {
            console.log('client', socket.id, 'disconnected')
            const index = users.indexOf(socket.id)
            if (index !== -1) users.splice(index)
            io.emit('updateUserList', users)
        })
    })
}
