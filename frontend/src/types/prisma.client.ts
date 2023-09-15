/**
 * Model refreshToken
 *
 */
export type refreshToken = {
    tokenValue: string
    username: string
}

/**
 * Model user
 *
 */
export type user = {
    username: string
    createTime: Date
}

/**
 * Model userSettings
 *
 */
export type userSettings = {
    key: number
    displayName: string
    profilePicturePath: string | null
    username: string
}

/**
 * Model passwordHash
 *
 */
export type passwordHash = {
    key: number
    username: string
    hash: string
}

/**
 * Model roomConfig
 *
 */
export type roomConfig = {
    key: number
    username: string
    roomId: string
    isHidden: boolean
}

/**
 * Model room
 *
 */
export type room = {
    roomId: string
    roomDisplayName: string
    roomDisplayImagePath: string | null
    isMaxCapacityTwo: boolean
}

/**
 * Model userRoomParticipation
 *
 */
export type userRoomParticipation = {
    key: number
    username: string
    roomId: string
}

/**
 * Model message
 *
 */
export type message = {
    key: string
    senderUsername: string
    roomId: string
    content: string
    createdAt: Date
    editedAt: Date | null
    contentType: MessageContentType
    extension: string | null
}

// CUSTOM TYPES //

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

export type User = user

export type UserSettings = userSettings

export type PasswordHash = passwordHash

export type RoomConfig = roomConfig

export type Room = room

export type UserRoomParticipation = userRoomParticipation

export type Message = message

export type MessageToClient = Omit<message, 'contentType' | 'content'> &
    (
        | { contentType: MessageContentType.text; content: string }
        | {
              contentType: Exclude<MessageContentType, MessageContentType.text>
              content: ArrayBuffer
              extension: string
          }
    )

export type MessageToServer = Message
// Omit<message, 'contentType' | 'content'> &
//     (
//         | { contentType: MessageContentType.text; content: string }
//         | {
//               contentType: Exclude<MessageContentType, MessageContentType.text>
//               content: File | Blob
//               extension: string
//           }
//     )
