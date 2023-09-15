import { Buffers } from '@react-frontend-developer/buffers'
import { Socket } from 'socket.io-client'

import {
    Message,
    Room,
    UserRoomParticipation,
    User,
    MessageToClient,
    MessageToServer,
    UserSettings,
} from './prisma.client'

export interface ServerToClientEvents {
    noArg: () => void
    withAck: (d: string, callback: (e: number) => void) => void
    message: (message: MessageToClient) => void
    // userRoomsUpdated: (rooms: RoomWithParticipants[]) => void
    // userRoomUpdated: (room: RoomWithParticipants) => void
    // roomChanged: (room: RoomWithParticipants) => void
    // messagesRequested: (messages: Message[]) => void // TODO: move to fetch call
    // userSettingsUpdated: (newSettings: Settings) => void

    newRoomCreated: (roomDetails: RoomWithParticipants) => void
}

// for socket.on()
export interface ClientToServerEvents {
    message: (message: MessageToServer) => void
    addUsersToRoom: (usersToAdd: string[], roomName: string) => void
    createNewPrivateRoom: (participant: string, callback: (response: string | null) => void) => void
    createNewGroup: (participants: string[], displayName: string, callback: (response: string | null) => void) => void
    roomSelected: (roomId: string) => void
    messagesRequested: (roomId: string) => void
    addParticipantsToGroup: (participants: string[], roomId: string, callback: (response: string) => void) => void
    userSettingsUpdated: (newSettings: Settings) => void
}

export type Nullable<T> = { [U in keyof T]: null | T[U] }

// export type Settings = Nullable<Pick<User, 'userDisplayName'>> & { userDisplayImage: null | ArrayBuffer }
export type Settings = Pick<UserSettings, 'displayName' | 'profilePicturePath'>

export type SocketWithCustomEvents = Socket<ServerToClientEvents, ClientToServerEvents>

// export type Participants = string[]
//
// export type RoomWithParticipants = Room & { participants: Participants }

export type RoomWithParticipants = Room & {
    participants: {
        username: string
    }[]
}
