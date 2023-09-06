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
    extension: string | null
}

// CUSTOM TYPES //

/**
 * Enums
 */

export enum MessageContentType {
    audio,
    video,
    text,
    image,
    file,
}

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

export type MessageToServer = Omit<message, 'contentType' | 'content'> &
    (
        | { contentType: MessageContentType.text; content: string }
        | {
              contentType: Exclude<MessageContentType, MessageContentType.text>
              content: File | Blob
              extension: string
          }
    )
