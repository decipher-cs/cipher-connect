import { UserRoom } from '@prisma/client'
import { prisma } from '../server.js'

export const getUser = async (username: string) => {
    return await prisma.user.findUnique({
        where: { username },
    })
}

export const getUserById = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { userId },
    })
}

export const getUsersById = async (userIDs: string[]) => {
    return await prisma.user.findMany({
        where: {
            userId: { in: userIDs },
        },
    })
}

export const getUsers = async (usernames: string[]) => {
    return await prisma.user.findMany({
        where: {
            username: { in: usernames },
        },
    })
}

export const getRoomPariticpants = async (roomId: string) => {
    return await prisma.room.findUnique({
        where: { roomId },
        // select: { participants: true },
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
    const rooms = await prisma.room.findMany({
        where: {
            AND: [
                { roomType: 'private' },
                { user: { some: { username: userA } } },
                { user: { some: { username: userB } } },
            ],
        },
    })
    return rooms.length > 0
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
    const rooms = await prisma.user.findFirst({ where: { username }, select: { rooms: true } })
    return rooms?.rooms.map(room => ({ roomId: room.roomId }))
}

export const justFetchTheDatabaseDarnIt = async (username: string) => {
    const rooms = await prisma.userRoom.findMany({
        where: { username },
        include: {
            room: { include: { user: true } },
            user: true,
            roomConfig: true,
        },
    })
    return rooms
}
