import { Server, Socket } from 'socket.io'
import {
    addNewNetworkNameToNetworks,
    getUserNetworkList,
    getUsernameFromRefreshToken,
    removeConnectionFromNetwork,
} from './model.js'
import cookieParser from 'cookie-parser'
import { NextFunction } from 'express'

interface ServerToClientEvents {
    noArg: () => void
    basicEmit: (a: number, b: string, c: Buffer) => void
    withAck: (d: string, callback: (e: number) => void) => void
    updateNetworkList: (users: string[]) => void
    privateMessage: (target: string, msg: string) => void
}

// for io.on()
interface InterServerEvents {}

// for socket.on()
interface ClientToServerEvents {
    privateMessage: (target: string, msg: string) => void
    updateNetworkList: (users: string[]) => void
    addUserToNetwork: (newConnectionName: string, callback: (response: null | string) => void) => void
    removeUserFromNetwork: (newConnectionName: string) => void // might wanna use acknowledgment here
}

interface SocketData {
    username: string
}

export const initSocketIO = (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    // Set socket.data.username on socket
    io.use((socket, next) => {
        const username: string | undefined = socket.handshake.auth.username

        if (username === undefined) return next(new Error('Username not valid'))

        socket.data.username = username

        return next()
    })

    io.on('connection', socket => {
        if (socket.data.username === undefined) throw new Error('Socket.data.username is undefined')

        const username = socket.data.username

        const userNetworkList: string[] = []

        // Get list of network from the DB
        getUserNetworkList(username).then(networkList => {
            userNetworkList.push(...networkList)
            socket.emit('updateNetworkList', userNetworkList)
        })

        socket.join(username)

        socket.on('privateMessage', (target: string, msg: string) => {
            if (target !== socket.id) {
                socket.to(target).emit('privateMessage', target, msg)
            } else throw new Error('Message cannot be sent to self')
        })

        socket.on('updateNetworkList', () => {
            socket.emit('updateNetworkList', userNetworkList)
        })

        socket.on('addUserToNetwork', (newConnectionName: string, callback) => {
            if (userNetworkList.includes(newConnectionName) === false)
                addNewNetworkNameToNetworks(username, [newConnectionName])
                    .then(usernameUpdateCount => {
                        userNetworkList.push(newConnectionName)
                    })
                    .catch(err => {
                        callback('some err found')
                        console.log('err is :', err)
                    }) // show error to client that user doesn't exist
        })

        socket.on('removeUserFromNetwork', (connectionName: string) => {
            if (userNetworkList.includes(connectionName) === true)
                removeConnectionFromNetwork(username, [connectionName])
                    .then(_ => {
                        const index = userNetworkList.indexOf(connectionName)
                        if (index !== -1) userNetworkList.splice(index)
                    })
                    .catch(err => console.log('while deleting a user from the network list:', err))
        })

        socket.on('disconnect', () => {
            // const index = users.indexOf(username)
            // if (index !== -1) users.splice(index)
            // io.emit('updateNetworkList', users)
        })
    })
}
