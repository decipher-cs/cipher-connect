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
    passwordHash: string
    displayName: string
    avatarPath: string | null
    status: UserStatus
}

/**
 * Model Room
 *
 */
export type Room = {
    roomId: string
    roomType: RoomType
    roomDisplayName: string | null
    roomAvatar: string | null
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
    isBlocked: boolean
    lastReadMessage: string | null
    isHidden: boolean
    isNotificationMuted: boolean
    isMarkedFavourite: boolean
    isPinned: boolean
}

/**
 * Model Message
 *
 */
export type ServerMessage = {
    key: string
    senderUsername: string
    roomId: string
    content: string
    createdAt: Date
    editedAt: Date | null
    contentType: MessageContentType
}

/**
 * Model Session
 *
 */
export type Session = {
    id: string
    sid: string
    data: string
    expiresAt: Date
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

export enum UserStatus {
    available = 'available',
    dnd = 'dnd',
    hidden = 'hidden',
}

export type MessageDeliveryStatus = 'delivered' | 'delivering' | 'failed'

export type Message = ServerMessage & { deliveryStatus: MessageDeliveryStatus }

export type UserWithoutID = Omit<User, 'userId'>

export type RoomWithParticipants = Room & { participants: User['username'][] }

export type RoomOptions = UserRoom

export type RoomDetails = RoomWithParticipants & RoomOptions
