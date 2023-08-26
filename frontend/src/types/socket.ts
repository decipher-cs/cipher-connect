import { Buffers } from '@react-frontend-developer/buffers'
import { Socket } from 'socket.io-client'

import {
    message as Message,
    room as Room,
    userRoomParticipation as UserRoomParticipation,
    user as User,
    MessageContentType,
} from './prisma.client'

export interface ServerToClientEvents {
    noArg: () => void
    withAck: (d: string, callback: (e: number) => void) => void
    message: (
        targetRoomId: string,
        msg: string | ArrayBuffer,
        senderUsername: string,
        messageType: MessageContentType
    ) => void
    userRoomsUpdated: (rooms: RoomWithParticipants[]) => void
    userRoomUpdated: (room: RoomWithParticipants) => void
    roomChanged: (room: RoomWithParticipants) => void
    sendingMessages: () => void
    messagesRequested: (messages: Message[]) => void
    userSettingsUpdated: (newSettings: Settings) => void
}

// for socket.on()
export interface ClientToServerEvents {
    message: (targetRoomId: string, msg: string | Buffers, messageType: MessageContentType) => void
    addUsersToRoom: (usersToAdd: string[], roomName: string) => void
    createNewPrivateRoom: (participant: string, callback: (response: string) => void) => void
    createNewGroup: (participants: string[], displayName: string, callback: (response: string) => void) => void
    roomSelected: (roomId: string) => void
    messagesRequested: (roomId: string) => void
    addParticipantsToGroup: (participants: string[], roomId: string, callback: (response: string) => void) => void
    userSettingsUpdated: (newSettings: Settings) => void
}

type Nullable<T> = { [U in keyof T]: null | T[U] }

export type Settings = Nullable<Pick<User, 'userDisplayName'>> & { userDisplayImage: null | ArrayBuffer }

export type SocketWithCustomEvents = Socket<ServerToClientEvents, ClientToServerEvents>

export type Participants = Pick<UserRoomParticipation, 'username'> &
    Pick<User, 'userDisplayName'> &
    Pick<User, 'userDisplayImage'>

export type RoomWithParticipants = Room & { participants: Participants[] }
