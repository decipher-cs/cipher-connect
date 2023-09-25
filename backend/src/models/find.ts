import { prisma } from "../server.js";

export const getUserFromDB = async (username: string) => {
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
export const getAllUsers = async () => {
    const allUsers = await prisma.user.findMany()
    return allUsers
}
export const getUsersFromDB = async (usernames: string[]) => {
    return await prisma.user.findMany({
        where: {
            username: { in: usernames },
        },
    })
}
export const getAllRoomPariticpants = async (roomId: string) => {
    const participants = await prisma.room.findUnique({
        where: { roomId },
        select: { participants: true },
    })
    return participants?.participants.map(p => p.username)
}


export const getAllMessagesFromRoom = async (roomId: string) => {
    const messages = await prisma.room.findUnique({
        where: { roomId },
        select: {
            message: true,
        },
    })

    return messages?.message
}
export const privateRoomExists = async (userA: string, userB: string) => {
    const rooms = await prisma.room.findMany({
        where: {
            AND: [
                { isMaxCapacityTwo: true },
                { participants: { some: { username: userA } } },
                { participants: { some: { username: userB } } },
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

export const getAllRooms = async (username: string) => {
    return await prisma.userRoomParticipation.findMany()
}

export const getBasicRoomDetails = async (roomId: string) => {
    return await prisma.room.findUnique({
        where: {
            roomId,
        },
    })
}

export const getUserRooms = async (username: string) => {
    const rooms = await prisma.room.findMany({
        where: { participants: { some: { username } } },
    })
    return rooms
}

export const getUserRoomIDs = async (username: string) => {
    const rooms = await prisma.userRoomParticipation.findMany({ where: { username } })
    return rooms.map(room => ({ roomId: room.roomId }))
}

export const getUserRoomsAlongParticipants = async (username: string): Promise<RoomWithParticipants[]> => {
    // const rooms = await prisma.room.findMany({
    //     where: { participants: { some: { username } } },
    //     include: { participants: { select: { user: true } } },
    // })
    // return rooms.map(room => ({
    //     ...room,
    //     participants: room.participants.map(({ user }) => user),
    // }))
    const rooms = await prisma.user.findMany({
        where: { username },
        select: { room },
    })
}

// : Promise<RoomWithParticipantsAndConfig[]>
export const getUserRoomsAlongParticipantsAndConfig = async (username: string) => {
    const rooms = await prisma.userRoomParticipation.findMany({
        where: { username },
        select: {
            room: { include: { participants: true } },
            user: true,
            roomConfig: true,
        },
    })
    return rooms
}
export const getUserHash = async (username: string) => {
    const hash = await prisma.user.findUnique({
        where: { username },
        select: { passwordHash: true },
    })
    return hash
}
