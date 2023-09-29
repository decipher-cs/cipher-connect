import { Buffers } from '@react-frontend-developer/buffers'
import { Socket } from 'socket.io-client'

import { Message, Room, User, RoomConfig, UserRoom, RoomType, RoomDetails } from './prisma.client'

export interface ServerToClientEvents {
    noArg: () => void
    withAck: (d: string, callback: (e: number) => void) => void
    message: (message: Message) => void

    newRoomCreated: (roomDetails: RoomDetails) => void

    userProfileUpdated: (newSettings: Partial<User>) => void
    notification: (roomId: Room['roomId']) => void
}

// for socket.on()
export interface ClientToServerEvents {
    message: (message: Message) => void
    createNewPrivateRoom: (participant: string, callback: (response: string | null) => void) => void
    createNewGroup: (participants: string[], displayName: string, callback: (response: string | null) => void) => void
    userProfileUpdated: (newSettings: Partial<User>) => void
    roomUpdated: (updatedDetails: Partial<Room>) => void
    notification: (roomId: Room['roomId']) => void
    // addUsersToRoom: (usersToAdd: string[], roomName: string) => void
    // addParticipantsToGroup: (participants: string[], roomId: string, callback: (response: string) => void) => void
}

export type Nullable<T> = { [U in keyof T]: null | T[U] }

export type SocketWithCustomEvents = Socket<ServerToClientEvents, ClientToServerEvents>
