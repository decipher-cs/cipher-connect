import { Server } from 'socket.io'
import { Message, Room, User, RoomConfig, RoomType } from '@prisma/client'
import {
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData,
    UserWithoutID,
    TypingStatus,
} from './types.js'
import {
    checkIfPrivateRoomExists,
    getRoomDetails,
    getRoomIDsByUsername,
    getUser,
    getUserRoomConfig,
    getUsers,
} from './models/find.js'
import { addMessageToDB, createGroup, createPrivateRoom } from './models/create.js'
import { updateMessageReadStatus, updateUser } from './models/update.js'
import { updateRoomParticipants } from './models/update.js'
import { deleteRoom, deleteUserRoom } from './models/delete.js'

export const initSocketIO = (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    // Set socket.data.username on socket
    io.use(async (socket, next) => {
        const username: string | undefined = socket.handshake.auth.username

        if (username === undefined) return next(new Error('Username not valid'))
        if ((await getUser(username)) === null) return next(new Error('Username not in database'))

        socket.data.username = username

        return next()
    })

    io.on('connection', socket => {
        if (socket.data.username === undefined) throw new Error('Socket.data.username is undefined')

        const username = socket.data.username

        socket.join(username)

        const joinedRooms: Room['roomId'][] = []
        // Get all rooms user is participating in.
        getRoomIDsByUsername(username).then(rooms =>
            rooms?.forEach(({ roomId }) => {
                socket.join(roomId)
                joinedRooms.push(roomId)
            })
        )

        socket.on('message', async message => {
            socket.broadcast.to(message.roomId).emit('message', message)
            socket.broadcast.to(message.roomId).emit('notification', message.roomId)

            try {
                addMessageToDB(message)
                updateMessageReadStatus(message.roomId, true)
            } catch (error) {
                console.log('error uploading to server', error)
            }
        })

        socket.on('userProfileUpdated', async user => {
            // If null (meaning value unchanged from last time) then send undefined
            // to model because undefined while updaing entry in DB is treated as no-change.

            updateUser(username, user)

            // emit to room that the user is in.
            socket.broadcast.in(joinedRooms).emit('userProfileUpdated', user)
        })

        socket.on('roomUpdated', updatedDetails => {})

        socket.on('newRoomCreated', async room => {
            const participants = room.roomType === RoomType.private ? [room.participant] : room.participants
            participants.push(username)
            console.log(room)

            try {
                let roomId: string | undefined
                if (room.roomType === RoomType.private) {
                    roomId = await createPrivateRoom(username, room.participant)
                } else if (room.roomType === RoomType.group) {
                    roomId = await createGroup(room.participants, room.displayName)
                }
                if (roomId !== undefined) {
                    io.to(participants).socketsJoin(roomId)
                    io.to(participants).emit('newRoomCreated', roomId)
                }
            } catch (err) {
                console.log(err)
            }
        })

        socket.on('userLeftRoom', roomId => {
            deleteUserRoom(username, roomId)
            io.in(roomId).emit('userLeftRoom', username, roomId)
        })

        socket.on('roomDeleted', roomId => {
            deleteRoom(roomId)
            io.in(roomId).emit('roomDeleted', roomId)
        })

        socket.on('userJoinedRoom', async (roomId, participants) => {
            await updateRoomParticipants(roomId, participants)

            const users = await getUsers(participants)

            if (users) io.in(roomId).emit('userJoinedRoom', roomId, users)

            io.to(participants).emit('newRoomCreated', roomId)
        })

        socket.on('typingStatusChanged', (status, roomId, username) => {
            socket.in(roomId).emit('typingStatusChanged', status, roomId, username)
        })

        socket.on('disconnect', () => {
            socket.in(joinedRooms).emit('typingStatusChanged', TypingStatus.notTyping, '', username)
        })
    })
}
