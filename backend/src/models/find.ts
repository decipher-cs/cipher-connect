import { Room, RoomConfig, User, UserRoom } from '@prisma/client'
import { prisma } from '../server.js'
import { RoomDetails, UserWithoutID } from '../types.js'

export const getUser = async (username: string): Promise<UserWithoutID | null> => {
    return await prisma.user.findUnique({
        where: { username },
        select: {
            userId: false,
            username: true,
            createTime: true,
            displayName: true,
            avatarPath: true,
            status: true,
        },
    })
}

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { userId },
        select: {
            userId: false,
            username: true,
            createTime: true,
            displayName: true,
            avatarPath: true,
        },
    })

    return user
}

export const getUsersById = async (userIDs: string[]): Promise<UserWithoutID[] | null> => {
    return await prisma.user.findMany({
        where: {
            userId: { in: userIDs },
        },
        select: {
            userId: false,
            username: true,
            createTime: true,
            displayName: true,
            avatarPath: true,
            status: true,
        },
    })
}

export const getUsers = async (usernames: string[]): Promise<UserWithoutID[] | null> => {
    return await prisma.user.findMany({
        where: {
            username: { in: usernames },
        },
        select: {
            userId: false,
            username: true,
            createTime: true,
            displayName: true,
            avatarPath: true,
            status: true,
        },
    })
}

export const checkIfUserExists = async (username: User['username']): Promise<boolean> => {
    const user = await prisma.user.count({ where: { username } })
    return user === 1
}

export const getRoomPariticpants = async (roomId: string) => {
    return await prisma.room.findUnique({
        where: { roomId },
        select: { user: true },
    })
}

export const getMessagesFromRoom = async (roomId: string) => {
    const messages = await prisma.room.findUnique({
        where: { roomId },
        select: {
            message: true,
        },
    })

    return messages?.message
}

export const checkIfPrivateRoomExists = async (userA: string, userB: string) => {
    return await prisma.room.findFirst({
        where: {
            AND: [
                { roomType: 'private' },
                { user: { some: { username: userA } } },
                { user: { some: { username: userB } } },
            ],
        },
    })
}

export const getRefreshToken = async (username: string) => {
    const refreshToken = await prisma.refreshToken.findMany({
        where: { username },
        select: { tokenValue: true },
    })

    const tokenArr = refreshToken.map(({ tokenValue }) => tokenValue)

    return tokenArr
}

export const getUserHash = async (username: string) => {
    const hash = await prisma.user.findUnique({
        where: { username },
        select: { passwordHash: true },
    })
    return hash
}

export const getUsernameFromRefreshToken = async (token: string) => {
    const username = await prisma.refreshToken.findUnique({
        where: { tokenValue: token },
        select: { username: true },
    })
    return username
}

export const getRoomsByUsername = async (username: string) => {
    return await prisma.user.findFirst({
        where: { username },
        select: { rooms: true },
    })
}

export const getRoomIDsByUsername = async (username: string) => {
    const rooms = await prisma.user.findUnique({ where: { username }, select: { rooms: { select: { roomId: true } } } })
    return rooms?.rooms ?? null
}

export const getRoomConfig = async (username: User['username'], roomId: Room['roomId']) => {
    return await prisma.roomConfig.findUnique({
        where: { username_roomId: { username, roomId } },
    })
}

export const getUserRoomConfig = async (username: User['username'], roomId: Room['roomId']) => {
    return await prisma.userRoom.findUnique({
        where: { username_roomId: { username, roomId } },
    })
}

export const getRoomDetails = async (
    id: { username: User['username'] } | { roomId: Room['roomId'] }
): Promise<RoomDetails[]> => {
    const rooms = await prisma.userRoom.findMany({
        where: id,
        include: {
            roomConfig: true,
            room: {
                include: {
                    user: true,
                },
            },
        },
    })

    return rooms.map(defaultRoom => {
        const { room: denestedRoom, roomConfig, ...rest } = defaultRoom

        const { user, ...room } = denestedRoom

        return { ...rest, ...room, ...roomConfig, participants: user }
    })
}

export const getUniqueRoomDetails = async (
    username: User['username'],
    roomId: Room['roomId']
): Promise<RoomDetails | null> => {
    const room = await prisma.userRoom.findUnique({
        where: { username_roomId: { username, roomId } },
        include: {
            roomConfig: true,
            room: {
                include: {
                    user: true,
                },
            },
        },
    })
    if (room === null) return null

    const { room: roomAndUsers, roomConfig, ...userRoom } = room
    const { user, ...roomWithoutUserAndConfig } = roomAndUsers
    return { ...userRoom, ...roomWithoutUserAndConfig, ...roomConfig, participants: user }
}
