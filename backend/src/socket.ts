import { Server } from 'socket.io'
import {
    addMessageToDB,
    createPrivateRoomAndAddParticipants,
    // createGroup,
    // createPrivateRoom,
    getAllMessagesFromRoom,
    getRoomDetailsWithParticipants,
    // getAllUserRooms,
    getRoomsContainingUser,
    getRoomsContainingUserWithRoomParticipants,
    getUserFromDB,
    // getUserAndUserRoomsFromDB,
    // getUserRoomsFromDB,
    // removeParticipantFromRoom,
} from './model.js'
import { message, room, userRoomParticipation } from '@prisma/client'

interface ServerToClientEvents {
    noArg: () => void
    basicEmit: (a: number, b: string, c: Buffer) => void
    withAck: (d: string, callback: (e: number) => void) => void
    privateMessage: (targetRoomId: string, msg: string, senderUsername: string) => void
    userRoomsUpdated: (
        rooms: {
            roomId: string
            roomDisplayName: string
            isMaxCapacityTwo: boolean
            participants: {
                username: string
                key?: number
            }[]
        }[]
    ) => void

    roomChanged: (room: room) => void
    messagesRequested: (messages: message[]) => void
}

// for io.on()
interface InterServerEvents {}

// for socket.on()
interface ClientToServerEvents {
    privateMessage: (targetRoomId: string, msg: string) => void
    addUsersToRoom: (usersToAdd: string[], roomName: string) => void
    createNewPrivateRoom: (participant: string, callback: (response: string) => void) => void
    createNewGroup: (participants: string[], displayName: string, callback: (response: string) => void) => void
    roomSelected: (roomId: string) => void
    messagesRequested: (roomId: string) => void
    leaveRoom: (roomId: string) => void
}

interface SocketData {
    username: string
}

export const initSocketIO = (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    // Set socket.data.username on socket
    io.use(async (socket, next) => {
        const username: string | undefined = socket.handshake.auth.username

        if (username === undefined) return next(new Error('Username not valid'))
        if ((await getUserFromDB(username)) === null) return next(new Error('Username not in database'))

        socket.data.username = username

        return next()
    })

    io.on('connection', socket => {
        if (socket.data.username === undefined) throw new Error('Socket.data.username is undefined')

        const username = socket.data.username

        const userRooms: Awaited<ReturnType<typeof getRoomsContainingUserWithRoomParticipants>> = []

        getRoomsContainingUserWithRoomParticipants(username).then(rooms => {
            if (rooms === undefined) return
            userRooms.push(...rooms)
            socket.emit('userRoomsUpdated', rooms)
        })

        // Following 2 lines do not make any sense anymore. I forgot why I put them here. I'll have to figure it out ;P
        socket.rooms.forEach(roomId => socket.leave(roomId))
        socket.join(username)

        socket.on('privateMessage', async (targetRoomId, messageContent) => {
            socket.broadcast.to(targetRoomId).emit('privateMessage', targetRoomId, messageContent, username)
            // Sync the broadcast and the insert call made to DB
            const msg = await addMessageToDB(username, targetRoomId, messageContent)
            console.log(msg)
        })

        socket.on('createNewPrivateRoom', async (participant, callback) => {
            const roomsContainingUser = await getRoomsContainingUserWithRoomParticipants(participant)

            // check if participants are already in a private room with current username. If they are not, then create a new room
            const roomAlreadyExists = roomsContainingUser.some(room => {
                return room.isMaxCapacityTwo && room.participants.some(obj => obj.username === participant)
            })

            if (roomAlreadyExists !== false) {
                callback('Already In A Room With User')
                return
            }

            const participantExists = await getUserFromDB(participant)
            if (participantExists === null) {
                callback('User does not exists')
                return
            }

            try {
                const room = await createPrivateRoomAndAddParticipants(username, participant)
                if (room !== null) {
                    userRooms.push(room)
                    socket.emit('userRoomsUpdated', userRooms)
                    callback('Success')
                }
            } catch (err) {
                console.log(err)
                callback('Unknown Server Error')
            }
        })

        // socket.on('roomSelected', roomId => {
        //     const room = userRooms.find(room => room.roomId === roomId)
        //     if (room !== undefined) {
        //         socket.emit('roomChanged', room)
        //     }
        //     socket.rooms.forEach(room => socket.leave(room))
        //     socket.join(roomId)
        // })

        socket.on('messagesRequested', async roomId => {
            if (userRooms.find(room => room.roomId === roomId) === undefined) return
            const messages = await getAllMessagesFromRoom(roomId)
            if (messages !== undefined) socket.emit('messagesRequested', messages)
        })

        socket.on('disconnect', () => {})
    })
}
