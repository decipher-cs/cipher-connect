import { Socket } from 'socket.io-client'
import { message as Message, room as Room, userRoomParticipation as UserRoomParticipation, user as User } from './prisma.client'

export interface ServerToClientEvents {
    noArg: () => void
    withAck: (d: string, callback: (e: number) => void) => void
    privateMessage: (targetRoomId: string, msg: string, senderUsername: string) => void
    userRoomsUpdated: (rooms: RoomWithParticipants[]) => void
    userRoomUpdated: (room: RoomWithParticipants) => void
    roomChanged: (room: RoomWithParticipants) => void
    sendingMessages: () => void
    messagesRequested: (messages: Message[]) => void
}

// for socket.on()
export interface ClientToServerEvents {
    privateMessage: (targetRoomId: string, msg: string) => void
    addUsersToRoom: (usersToAdd: string[], roomName: string) => void
    createNewPrivateRoom: (participant: string, callback: (response: string) => void) => void
    createNewGroup: (participants: string[], displayName: string, callback: (response: string) => void) => void
    roomSelected: (roomId: string) => void
    messagesRequested: (roomId: string) => void
    addParticipantsToGroup: (participants: string[], roomId: string, callback: (response: string) => void) => void
    userSettingsUpdated: (newSettings: Settings) => void
}

export type Settings = Pick<User, 'userDisplayName'> & { userDisplayImage: NonNullable<User['userDisplayImage']> }
export type SocketWithCustomEvents = Socket<ServerToClientEvents, ClientToServerEvents>
export type Participants = Pick<UserRoomParticipation, 'username'>[]
export type RoomWithParticipants = Room & { participants: Participants }
