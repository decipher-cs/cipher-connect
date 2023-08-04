import { Server } from 'socket.io'
import {
    addMessageToDB,
    createPrivateRoomAndAddParticipants,
    getAllMessagesFromRoom,
    getRoomsContainingUserWithRoomParticipants,
    getUserFromDB,
    createGroupAndAddParticipantsToGroup,
    addParticipantsToGroup,
    updateUserSettings,
    getUserSettings,
} from './model.js'
import { message, room, user, userRoomParticipation } from '@prisma/client'

export type Participants = Pick<userRoomParticipation, 'username'>[]

export type RoomWithOptionalImg = Omit<room, 'roomDisplayName'> & Partial<Pick<room, 'roomDisplayImage'>>

export type RoomWithParticipants = RoomWithOptionalImg & { participants: Participants }

type Nullable<T> = { [U in keyof T]: null | T[U] }

export type Settings = Nullable<Pick<user, 'userDisplayName'>> & { userDisplayImage: null | ArrayBuffer }

interface ServerToClientEvents {
    noArg: () => void
    basicEmit: (a: number, b: string, c: Buffer) => void
    withAck: (d: string, callback: (e: number) => void) => void
    privateMessage: (targetRoomId: string, msg: string, senderUsername: string) => void
    userRoomsUpdated: (rooms: RoomWithParticipants[]) => void
    userRoomUpdated: (room: RoomWithParticipants) => void
    roomChanged: (room: RoomWithParticipants) => void
    messagesRequested: (messages: message[]) => void
    userSettingsUpdated: (newSettings: Settings) => void
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
    addParticipantsToGroup: (participants: string[], roomId: string, callback: (response: string) => void) => void
    userSettingsUpdated: (newSettings: Settings) => void
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

        getUserSettings(username).then(settings => {
            socket.emit('userSettingsUpdated', settings)
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
                    socket.emit('userRoomsUpdated', userRooms)
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
                    socket.emit('userRoomsUpdated', userRooms)
                    callback('Success')
                }
            } catch (error) {
                console.log('error while creating group', error)
                callback('Server error')
            }
        })

        socket.on('addParticipantsToGroup', async (participants, roomId) => {
            try {
                const room = await addParticipantsToGroup(participants, roomId)
                console.log(room)
                if (room !== null) {
                    socket.emit('userRoomUpdated', room)
                    // also emit to the participants that they have been added to a new group
                }
            } catch (error) {
                console.log('Encountered error while adding participants to group. ERR:', error)
            }
        })

        socket.on('roomSelected', roomId => {
            const room = userRooms.find(room => room.roomId === roomId)
            if (room !== undefined) {
                socket.emit('roomChanged', room)
            }
            socket.join(roomId)
        })

        socket.on('userSettingsUpdated', newSettings => {
            // If null (meaning value unchanged from last time) then send undefined
            // to model because undefined while updaing entry in DB is treated as no-change.

            const displayName = newSettings.userDisplayName === null ? undefined : newSettings.userDisplayName
            const displayImage =
                newSettings.userDisplayImage === null ? undefined : Buffer.from(newSettings.userDisplayImage)

            updateUserSettings(username, displayName, displayImage)
            socket.emit('userSettingsUpdated', newSettings)
        })

        socket.on('messagesRequested', async roomId => {
            if (userRooms.find(room => room.roomId === roomId) === undefined) return
            const messages = await getAllMessagesFromRoom(roomId)
            if (messages !== undefined) socket.emit('messagesRequested', messages)
        })

        socket.on('disconnect', () => {})
    })
}
