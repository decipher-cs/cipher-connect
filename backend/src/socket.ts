import { Server } from 'socket.io'

export const initSocketIO = (io: Server) => {
    io.on('connection', socket => {
        socket.on('connect', () => {
            console.log('client connected', socket.id)
        })

        socket.onAny((event, ...args) => {
            console.log('--->IO<---\n', event, args)
        })

        socket.on('message', msg => {
            console.log(msg, '<----')
            socket.broadcast.emit('message', msg)
        })

        socket.on('disconnect', () => {
            console.log('client disconnected')
        })
    })
}
