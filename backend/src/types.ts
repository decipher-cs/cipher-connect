import { Message, Room, User, RoomConfig, UserRoom } from '@prisma/client'

export type UserWithoutID = Omit<User, 'userId'>

export type RoomWithParticipants = Room & { participants: UserWithoutID[] }

export type RoomWithParticipantsAndConfig = RoomWithParticipants & RoomConfig

export type RoomDetails = RoomWithParticipantsAndConfig & UserRoom

export type Nullable<T> = { [U in keyof T]: null | T[U] }

export interface ServerToClientEvents {
    noArg: () => void
    basicEmit: (a: number, b: string, c: Buffer) => void
    withAck: (d: string, callback: (e: number) => void) => void
    message: (message: Message) => void

    // newRoomCreated: (roomDetails: RoomDetails) => void
    newRoomCreated: (roomId: Room['roomId']) => void

    userProfileUpdated: (newSettings: Partial<User>) => void
    notification: (roomId: string) => void
    userLeftRoom: (username: User['username'], roomId: Room['roomId']) => void
    userJoinedRoom: (roomId: Room['roomId'], participants: UserWithoutID[]) => void
    roomDeleted: (roomId: Room['roomId']) => void
}

// for io.on()
export interface InterServerEvents {}

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

export interface SocketData {
    username: string
}
