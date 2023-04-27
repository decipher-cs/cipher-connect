import { Server } from 'socket.io'

export const initSocketIO = (io: Server) => {
    io.on('connection', socket => {
        socket.on('connection', () => {
            console.log('found user with id', socket.id)
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
