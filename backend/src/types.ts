import { Message, Room, User as UserInDB, UserRoom } from '@prisma/client'

export type User = Pick<UserInDB, 'username' | 'status' | 'createTime' | 'avatarPath' | 'displayName'>

export type RoomWithParticipants = Room & { participants: User['username'][] }

export type RoomOptions = UserRoom

export type RoomDetails = RoomWithParticipants & UserRoom

export type Nullable<T> = { [U in keyof T]: null | T[U] }

export enum TypingStatus {
    typing = 'typing',
    notTyping = 'not-typing',
}

export type NewRoomParameters =
    | {
          roomType: 'private'
          participant: User['username']
      }
    | {
          roomType: 'group'
          displayName: NonNullable<Room['roomDisplayName']>
          avatarPath: Room['roomAvatar']
          participants: User['username'][]
      }

export interface ServerToClientEvents {
    noArg: () => void
    basicEmit: (a: number, b: string, c: Buffer) => void
    withAck: (d: string, callback: (e: number) => void) => void
    message: (message: Message, callback: (status: 'ok') => void) => void

    newRoomCreated: (roomId: Room['roomId']) => void

    userProfileUpdated: (newSettings: Partial<User>) => void
    notification: (roomId: string) => void
    userLeftRoom: (username: User['username'], roomId: Room['roomId']) => void
    userJoinedRoom: (roomId: Room['roomId'], participants: User[]) => void
    roomDeleted: (roomId: Room['roomId']) => void
    typingStatusChanged: (status: TypingStatus, roomId: Room['roomId'], username: User['username']) => void
    messageDeleted: (messageKey: Message['key'], roomId: Room['roomId']) => void
    textMessageUpdated: (
        messageKey: Message['key'],
        messageContent: Message['content'],
        roomId: Room['roomId'],
        editedAt: Date
    ) => void
}

// for io.on()
export interface InterServerEvents {}

// for socket.on()
export interface ClientToServerEvents {
    message: (message: Message, callback: (status: 'ok') => void) => void
    userProfileUpdated: (newSettings: Partial<User>) => void
    roomUpdated: (updatedDetails: Partial<Room>) => void
    notification: (roomId: Room['roomId']) => void
    newRoomCreated: (paramteres: NewRoomParameters) => void
    userLeftRoom: (roomId: Room['roomId']) => void
    userJoinedRoom: (roomId: Room['roomId'], participants: User['username'][]) => void
    roomDeleted: (roomId: Room['roomId']) => void
    typingStatusChanged: (status: TypingStatus, roomId: Room['roomId'], username: User['username']) => void
    messageDeleted: (messageKey: Message['key'], roomId: Room['roomId']) => void
    textMessageUpdated: (messageKey: Message['key'], messageContent: Message['content'], roomId: Room['roomId']) => void
}

export interface SocketData {
    username: string
}
