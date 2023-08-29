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

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

// export const MessageContentType = {
//     audio: 'audio',
//     video: 'video',
//     text: 'text',
//     image: 'image',
// }

// export type MessageContentType = (typeof MessageContentType)[keyof typeof MessageContentType]

// CUSTOM TYPES //

// export type MessageWithContentAsBuffer = message | (message & { content: ArrayBuffer })
// export type MessageWithContentAsBuffer = Omit<message, 'content'> & { content: ArrayBuffer | string }

// export type MessageWithContentAsBlob = Omit<message, 'content'> & { content: Blob | string }

// export type MessageContentType = 'audio' | 'video' | 'text' | 'image'
export enum MessageContentType {
    audio,
    video,
    text,
    image,
}

export type Message = message

export type MessageFromServer =
    | (message & { contentType: MessageContentType.text; content: string })
    | (message & { contentType: Exclude<MessageContentType, MessageContentType.text>; content: ArrayBuffer })

export type MessageToServer = Omit<message, 'content'> & { content: File | Blob | string }
