import { Server } from 'socket.io'
import { createWriteStream } from 'fs'
import { readFile, readdir, writeFile } from 'fs/promises'
import {
    addMessageToDB,
    getAllMessagesFromRoom,
    getUserFromDB,
    getUserRooms,
    privateRoomExists,
    createRoomForTwo,
    createGroup,
    getUserRoomIDs,
    getUsersFromDB,
    updateUser,
} from './model.js'
import {
    MessageContentType,
    message as Message,
    room as Room,
    user as User,
    userRoomParticipation as UserRoomParticipation,
} from '@prisma/client'

export type RoomWithParticipants = Room & { participants: User[] }

type Nullable<T> = { [U in keyof T]: null | T[U] }

interface ServerToClientEvents {
    noArg: () => void
    basicEmit: (a: number, b: string, c: Buffer) => void
    withAck: (d: string, callback: (e: number) => void) => void
    message: (message: Message) => void

    userProfileUpdated: (newSettings: User) => void

    newRoomCreated: (roomDetails: RoomWithParticipants) => void
}

// for io.on()
interface InterServerEvents {}

// for socket.on()
interface ClientToServerEvents {
    message: (message: Message) => void
    addUsersToRoom: (usersToAdd: string[], roomName: string) => void
    createNewPrivateRoom: (participant: string, callback: (response: string | null) => void) => void
    createNewGroup: (participants: string[], displayName: string, callback: (response: string | null) => void) => void
    roomSelected: (roomId: string) => void
    messagesRequested: (roomId: string) => void
    addParticipantsToGroup: (participants: string[], roomId: string, callback: (response: string) => void) => void
    userProfileUpdated: (newSettings: User) => void
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

        socket.join(username)

        const joinedRooms: Room['roomId'][] = []
        // Get all rooms user is participating in.
        getUserRoomIDs(username).then(rooms =>
            rooms.forEach(({ roomId }) => {
                socket.join(roomId)
                joinedRooms.push(roomId)
            })
        )

        socket.on('message', async message => {
            socket.broadcast.to(message.roomId).emit('message', message)
            // TODO: notify everbody in the group about the new message by sending an emit('notify').

            try {
                await addMessageToDB(message)
            } catch (error) {
                console.log('error uploading to server', error)
            }
        })

        socket.on('createNewPrivateRoom', async (participant, callback) => {
            const participantExists = await getUserFromDB(participant)
            if (participantExists === null) {
                callback('User does not exists')
                return
            }

            if ((await privateRoomExists(participant, username)) === true) {
                callback('Already In A Room With User')
                return
            }

            try {
                const room = await createRoomForTwo(username, participant)

                const users = await getUsersFromDB([username, participant])

                if (room !== null) {
                    io.to([participant, username]).emit('newRoomCreated', {
                        ...room,
                        participants: users,
                    })
                    socket.join(room.roomId)

                    callback(null)
                } else if (room === null) {
                    callback('Unknown Server Error')
                }
            } catch (err) {
                console.log(err)
                callback('Unknown Server Error')
            }
        })

        socket.on('createNewGroup', async (participantsArray, groupDisplayName, callback) => {
            if (participantsArray.includes(username) === false) participantsArray.push(username)
            try {
                const room = await createGroup(participantsArray, groupDisplayName)

                const users = await getUsersFromDB(participantsArray)

                if (room === null) {
                    callback('Server Error')
                } else if (room !== null) {
                    io.to(participantsArray.toString()).emit('newRoomCreated', {
                        ...room,
                        participants: users,
                    })
                    socket.join(room.roomId)
                    callback(null)
                }
            } catch (error) {
                console.log('error while creating group', error)
                callback('Server error')
            }
        })

        socket.on('userProfileUpdated', async user => {
            // If null (meaning value unchanged from last time) then send undefined
            // to model because undefined while updaing entry in DB is treated as no-change.

            updateUser(username, user)

            // emit to room that the user is in.
            socket.broadcast.in(joinedRooms).emit('userProfileUpdated', user)
        })
        // TODO: [temp comment]
        // socket.on('addParticipantsToGroup', async (participants, roomId) => {
        //     if (userRooms.find(room => room.roomId === roomId)?.isMaxCapacityTwo === true) return
        //     try {
        //         const room = await addParticipantsToGroup(participants, roomId)
        //         console.log(room)
        //         if (room !== null) {
        //             socket.emit('userRoomUpdated', room)
        //             // also emit to the participants that they have been added to a new group
        //         }
        //     } catch (error) {
        //         console.log('Encountered error while adding participants to group. ERR:', error)
        //     }
        // })

        socket.on('disconnect', () => {})
    })
}
