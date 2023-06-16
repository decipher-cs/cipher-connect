// Model interactes with the database (mySQL) //

import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export const createNewUser = async (username: string, passwordHash: string) => {
    try {
        const returnedData = await prisma.user.create({ data: { username, passwordHash, displayName: username } })
        return returnedData
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') return null
        }
        throw err
    }
}

export const getAllUsers = async () => {
    const allUsers = await prisma.user.findMany()
    return allUsers
}

export const deleteAllUsers = async () => {
    const deletedUsers = await prisma.user.deleteMany()
    return deletedUsers
}

export const getUserFromDB = async (username: string) => {
    const users = await prisma.user.findUnique({
        where: { username },
    })

    return users
}

export const getUserHash = async (username: string) => {
    const hash = await prisma.user.findUnique({
        where: { username },
        select: { passwordHash: true },
    })
    return hash
}

export const addRefreshToken = async (username: string, token: string) => {
    const refreshToken = await prisma.refreshToken.create({ data: { username, tokenValue: token } })
    return refreshToken
}

export const deleteRefreshToken = async (username: string) => {
    const removedCount = await prisma.refreshToken.deleteMany({ where: { username } })
    return removedCount
}

export const getRefreshToken = async (username: string) => {
    const refreshToken = await prisma.refreshToken.findMany({
        where: { username },
        select: { tokenValue: true },
    })

    const tokenArr = refreshToken.map(({ tokenValue }) => tokenValue)

    return tokenArr
}

export const getUsernameFromRefreshToken = async (token: string) => {
    const username = await prisma.refreshToken.findUnique({
        where: { tokenValue: token },
        select: { username: true },
    })
    return username
}

export const addNewNetworkNameToNetworks = async (username: string, connectionNames: string[]) => {
    const data = connectionNames.map(connectionUsername => ({ username, connectionUsername }))

    const updatedUsernameCount = await prisma.userNetwork.createMany({ data: data })

    return updatedUsernameCount
}

export const getUserNetworkList = async (username: string) => {
    const network = await prisma.userNetwork.findMany({ where: { username }, select: { connectionUsername: true } })

    const networkArr = network.map(({ connectionUsername }) => connectionUsername)

    return networkArr
}

export const removeConnectionFromNetwork = async (username: string, connectionNames: string[]) => {
    const data = connectionNames.map(connectionUsername => ({ username, connectionUsername }))

    const removedCount = await prisma.userNetwork.deleteMany({
        where: { OR: data },
    })

    return removedCount
}

export const getUserAndUserRoomsFromDB = async (username: string) => {
    const rooms = await prisma.user.findUnique({
        where: { username },
        include: { rooms: { include: { participants: true } } },
    })

    return rooms
}

export const getUserRoomsFromDB = async (username: string) => {
    const rooms = await getUserAndUserRoomsFromDB(username)

    return rooms?.rooms
}

export const createPrivateRoom = async (participant1: string, participant2: string) => {
    const room = await prisma.room.create({
        data: {
            roomDisplayName: `${participant1}-${participant2}`.slice(0, 33),
            participants: {
                connect: [{ username: participant1 }, { username: participant2 }],
            },
            isMaxCapacityTwo: true,
        },
        include: { participants: true },
    })

    return room
}

export const createGroup = async (participantsUsernames: string[], roomDisplayName: string) => {
    if (participantsUsernames.length === 0) return undefined

    const participantsUsernamesObj = participantsUsernames.map(username => ({ username }))

    const group = await prisma.room.create({
        data: {
            roomDisplayName,
            isMaxCapacityTwo: false,
            participants: { connect: participantsUsernamesObj },
        },
        include: { participants: true },
    })

    return group
}

export const addMessageToDB = async (msgSender: string, roomId: string, textContent: string) => {
    const msg = await prisma.message.create({
        data: {
            content: textContent,
            roomId: roomId,
            senderUsername: msgSender,
        },
    })

    return msg
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

export const removeParticipantFromRoom = async (roomId: string, participantUsername: string) => {
    const room = await prisma.room.update({
        where: {
            roomId,
        },
        data: {
            participants: { disconnect: { username: participantUsername } },
        },
        include: { participants: true },
    })
    return room
}
