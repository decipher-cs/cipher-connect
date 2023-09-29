/**
 * Model RefreshToken
 *
 */
export type RefreshToken = {
    tokenValue: string
    username: string
}

/**
 * Model User
 *
 */
export type User = {
    userId: string
    username: string
    createTime: Date
    displayName: string
    avatarPath: string | null
}

/**
 * Model PasswordHash
 *
 */
export type PasswordHash = {
    id: number
    username: string
    hash: string
}

/**
 * Model RoomConfig
 *
 */
export type RoomConfig = {
    username: string
    roomId: string
    isHidden: boolean
    hasUnreadMessages: boolean
    isNotificationMuted: boolean
}

/**
 * Model Room
 *
 */
export type Room = {
    roomId: string
    roomDisplayName: string | null
    roomAvatar: string | null
    roomType: RoomType
}

/**
 * Model UserRoom
 *
 */
export type UserRoom = {
    username: string
    roomId: string
    joinedAt: Date
    isAdmin: boolean
    hasUnreadMessages: boolean
}

/**
 * Model Message
 *
 */
export type Message = {
    key: string
    senderUsername: string
    roomId: string
    content: string
    createdAt: Date
    editedAt: Date | null
    contentType: MessageContentType
}

/**
 * Enums
 */

export enum MessageContentType {
    audio = 'audio',
    video = 'video',
    text = 'text',
    image = 'image',
    file = 'file',
}

export enum RoomType {
    private = 'private',
    group = 'group',
}

export type UserWithoutID = Omit<User, 'userId'>

export type RoomWithParticipants = Room & { participants: UserWithoutID[] }

export type RoomWithParticipantsAndConfig = RoomWithParticipants & RoomConfig

export type RoomDetails = RoomWithParticipantsAndConfig & UserRoom
