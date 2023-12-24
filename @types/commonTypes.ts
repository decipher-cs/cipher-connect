import { User as UserWithPassword, UserRoom, Room } from '../prisma/index.js'

export type User = Omit<UserWithPassword, 'passwordHash'|'userId'>

export type RoomWithParticipants = Room & { participants: User['username'][] }

export type RoomOptions = UserRoom

export type RoomDetails = RoomWithParticipants & UserRoom
