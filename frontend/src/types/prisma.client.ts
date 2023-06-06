/**
 * Model user
 *
 */
export type user = {
    username: string
    displayName: string
    passwordHash: string
    createTime: Date
}

/**
 * Model refreshToken
 *
 */
export type refreshToken = {
    tokenValue: string
    username: string
}

/**
 * Model userNetwork
 *
 */
export type userNetwork = {
    key: number
    username: string
    connectionUsername: string
}

/**
 * Model room
 *
 */
export type room = {
    roomId: string
    roomDisplayName: string
    isMaxCapacityTwo: boolean
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
    updatedAt: Date
}
