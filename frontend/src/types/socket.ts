import { Buffers } from '@react-frontend-developer/buffers'
import { Socket } from 'socket.io-client'

import { Message, Room, User, RoomConfig, UserRoom, RoomType, RoomDetails, UserWithoutID } from './prisma.client'

export interface ServerToClientEvents {
    noArg: () => void
    withAck: (d: string, callback: (e: number) => void) => void
    message: (message: Message) => void

    newRoomCreated: (roomId: Room['roomId']) => void

    userProfileUpdated: (newSettings: Partial<User>) => void
    notification: (roomId: Room['roomId']) => void
    userLeftRoom: (username: User['username'], roomId: Room['roomId']) => void

    userJoinedRoom: (roomId: Room['roomId'], participants: UserWithoutID[]) => void
    roomDeleted: (roomId: Room['roomId']) => void
}

// for socket.on()
export interface ClientToServerEvents {
    message: (message: Message) => void
    userProfileUpdated: (newSettings: Partial<User>) => void
    roomUpdated: (updatedDetails: Partial<Room>) => void
    notification: (roomId: Room['roomId']) => void
    newRoomCreated: (participants: User['username'][], roomId: Room['roomId']) => void
    userLeftRoom: (roomId: Room['roomId']) => void
    userJoinedRoom: (roomId: Room['roomId'], participants: User['username'][]) => void
    roomDeleted: (roomId: Room['roomId']) => void
}

export type Nullable<T> = { [U in keyof T]: null | T[U] }

export type SocketWithCustomEvents = Socket<ServerToClientEvents, ClientToServerEvents>
