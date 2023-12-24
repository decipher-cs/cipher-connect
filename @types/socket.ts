import { Message, Room, User as UserWithPassword, UserRoom, RoomType } from '../prisma/index.d.js'

type User = Omit<UserWithPassword, 'passwordHash' | 'userId'>

export interface ServerToClientEvents {
    roomMembersChanged: (roomId: Room['roomId'], updatedMemberIds: User['username'][]) => void
    roomCreated: () => void
    test: (val?: string) => void

    noArg: () => void
    // withAck: (d: string, callback: (e: number) => void) => void
    message: (message: Message, callback: (status: 'ok') => void) => void

    newRoomCreated: (roomId: Room['roomId']) => void

    userProfileUpdated: (newSettings: Partial<User>) => void
    notification: (roomId: Room['roomId']) => void
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

export interface InterServerEvents {}

// for socket.on()
export interface ClientToServerEvents {
    message: (message: Message, callback: (status: 'ok') => void) => void
    userProfileUpdated: (newSettings: Partial<User>) => void
    roomUpdated: (updatedDetails: Partial<Room>) => void
    notification: (roomId: Room['roomId']) => void
    // newRoomCreated: (participants: User['username'][], roomId: Room['roomId']) => void
    newRoomCreated: (paramteres: NewRoomParameters) => void
    userLeftRoom: (roomId: Room['roomId']) => void
    userJoinedRoom: (roomId: Room['roomId'], participants: User['username'][]) => void
    roomDeleted: (roomId: Room['roomId']) => void
    typingStatusChanged: (status: TypingStatus, roomId: Room['roomId'], username: User['username']) => void
    messageDeleted: (messageKey: Message['key'], roomId: Room['roomId']) => void
    textMessageUpdated: (messageKey: Message['key'], messageContent: Message['content'], roomId: Room['roomId']) => void
}

export type NewRoomParameters =
    | {
          roomType: 'private'
          participant: User['username']
      }
    | {
          roomType: 'group'
          avatarPath: Room['roomAvatar']
          displayName: NonNullable<Room['roomDisplayName']>
          participants: User['username'][]
      }

export enum TypingStatus {
    typing = 'typing',
    notTyping = 'not-typing',
}

export interface SocketData {
    username: string
}
