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
  displayName: string
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
}

