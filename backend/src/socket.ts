import { Server } from 'socket.io'
import {
    addMessageToDB,
    createPrivateRoomAndAddParticipants,
    getAllMessagesFromRoom,
    getRoomsContainingUserWithRoomParticipants,
    getUserFromDB,
    createRoomForMany,
    createGroupAndAddParticipantsToGroup,
} from './model.js'
import { message, room, userRoomParticipation } from '@prisma/client'

export type Participants = Pick<userRoomParticipation, 'username'>[]
export type RoomWithParticipants = room & { participants: Participants }

interface ServerToClientEvents {
    noArg: () => void
    basicEmit: (a: number, b: string, c: Buffer) => void
    withAck: (d: string, callback: (e: number) => void) => void
    privateMessage: (targetRoomId: string, msg: string, senderUsername: string) => void
    userRoomsUpdated: (rooms: RoomWithParticipants[]) => void
    roomChanged: (room: RoomWithParticipants[]) => void
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
            console.log(rooms)
            socket.emit('userRoomsUpdated', rooms)
        })

        socket.join(username)

        socket.on('privateMessage', async (targetRoomId, messageContent) => {
            socket.broadcast.to(targetRoomId).emit('privateMessage', targetRoomId, messageContent, username)
            // Sync the broadcast and the insert call made to DB
            try {
                await addMessageToDB(username, targetRoomId, messageContent)
            } catch (error) {
                console.log('error uploading message to DB. Trying one more time.')
                await addMessageToDB(username, targetRoomId, messageContent)
            }
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
                    // socket.emit('userRoomsUpdated', userRooms)
                    callback('Success')
                }
            } catch (err) {
                console.log(err)
                callback('Unknown Server Error')
            }
        })

        socket.on('createNewGroup', async (participantsArray, groupDisplayName, callback) => {
            try {
                const room = await createGroupAndAddParticipantsToGroup(participantsArray, groupDisplayName)
                if (room !== null) {
                    userRooms.push(room)
                    // socket.emit('userRoomsUpdated', userRooms)
                    callback('Success')
                }
            } catch (error) {
                console.log('error while creating group', error)
                callback('Server error')
            }
        })

        // function to amend group/ room info

        socket.on('roomSelected', roomId => {
            const room = userRooms.find(room => room.roomId === roomId)
            if (room !== undefined) {
                // socket.emit('roomChanged', room)
            }
            socket.join(roomId)
        })

        socket.on('messagesRequested', async roomId => {
            if (userRooms.find(room => room.roomId === roomId) === undefined) return
            const messages = await getAllMessagesFromRoom(roomId)
            if (messages !== undefined) socket.emit('messagesRequested', messages)
        })

        socket.on('disconnect', () => {})
    })
}
