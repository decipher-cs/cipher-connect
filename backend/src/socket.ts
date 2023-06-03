import { Server } from 'socket.io'
import {
    createPrivateRoom,
    getUserAndUserRoomsFromDB,
    getUserFromDB,
    getUserNetworkList,
    getUserRoomsFromDB,
    removeConnectionFromNetwork,
} from './model.js'
import { room } from '@prisma/client'

interface ServerToClientEvents {
    noArg: () => void
    basicEmit: (a: number, b: string, c: Buffer) => void
    withAck: (d: string, callback: (e: number) => void) => void
    updateNetworkList: (users: string[]) => void
    privateMessage: (target: string, msg: string) => void
    userRoomsLoaded: (rooms: room[]) => void
    roomChanged: (roomId: string) => void
}

// for io.on()
interface InterServerEvents {}

// for socket.on()
interface ClientToServerEvents {
    privateMessage: (target: string, msg: string) => void
    updateNetworkList: (users: string[]) => void
    removeUserFromNetwork: (newConnectionName: string) => void // might wanna use acknowledgment here
    addUsersToRoom: (usersToAdd: string[], roomName: string) => void
    selectRoom: (roomId: string) => void
    addRoom: (participant: string, callback: (response: null | string) => void) => void
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

        // const userNetworkList: string[] = []

        const userRooms: Awaited<ReturnType<typeof getUserRoomsFromDB>> = []
        // const userRooms: Awaited<ReturnType<typeof getUserRoomsFromDB>> = []

        // Get list of network from the DB
        // getUserNetworkList(username).then(networkList => {
        //     userNetworkList.push(...networkList)
        //     socket.emit('updateNetworkList', userNetworkList)
        // })

        getUserRoomsFromDB(username).then(rooms => {
            console.log(rooms)
            if (rooms !== undefined) {
                userRooms.push(...rooms)
                socket.emit('userRoomsLoaded', rooms)
            }
        })

        socket.join(username)

        socket.on('privateMessage', (target: string, msg: string) => {
            if (target !== socket.id) {
                socket.to(target).emit('privateMessage', target, msg)
            } else throw new Error('Message cannot be sent to self')
        })

        // socket.on('updateNetworkList', () => {
        //     socket.emit('updateNetworkList', userNetworkList)
        // })

        // socket.on('removeUserFromNetwork', (connectionName: string) => {
        //     if (userNetworkList.includes(connectionName) === true)
        //         removeConnectionFromNetwork(username, [connectionName])
        //             .then(_ => {
        //                 const index = userNetworkList.indexOf(connectionName)
        //                 if (index !== -1) userNetworkList.splice(index)
        //             })
        //             .catch(err => console.log('while deleting a user from the network list:', err))
        // })

        socket.on('addRoom', async (participant, callback) => {
            // check if participant exists
            const participantUserDetails = await getUserAndUserRoomsFromDB(participant)

            if (participantUserDetails === null) {
                callback('User Does Not Exist')
                return
            }

            // check if participants are already in a private group with username
            participantUserDetails.rooms
            createPrivateRoom(username, participant)
                .then(room => {
                    userRooms.push(room)
                })
                .catch(_ => callback('some sort of error?')) // analyise which types of error can occur here.
        })

        socket.on('selectRoom', roomId => {
            socket.join(roomId)
            socket.emit('roomChanged', roomId)
        })

        socket.on('disconnect', () => {})
    })
}
