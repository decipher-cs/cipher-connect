import { Buffers as Buffer } from '@react-frontend-developer/buffers'

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
    userDisplayName: string
    userDisplayImage: Buffer | null
    createTime: Date
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
    roomDisplayImage: Buffer | null
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
    key: number
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

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const MessageContentType = {
    audio: 'audio',
    video: 'video',
    text: 'text',
    image: 'image',
}

export type MessageContentType = 'audio' | 'video' | 'text' | 'image'

// export type MessageContentType = (typeof MessageContentType)[keyof typeof MessageContentType]
