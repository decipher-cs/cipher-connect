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

export const getUserAndUserRoomsFromDB = async (username: string) => {
    const rooms = await prisma.userRoomConfig.findMany({
        where: { userUsername: username },
        include: { roomIdRelation: true },
    })

    return rooms
}

export const getUserRoomsFromDB = async (username: string) => {
    const rooms = await getUserAndUserRoomsFromDB(username)

    return rooms
}

export const createPrivateRoom = async (participant1: string, participant2: string) => {
    // const room = await prisma.userRoomConfig.createMany({
    //     data: [{ roomId: 'fawe', userUsername: 'afwe' }],
    // })
    const room = await prisma.userRoomConfig.createMany({
        data: {

            // roomIdRelation: {
            //     create: {
            //         roomDisplayName: `${participant1}-${participant2}`.slice(0, 33),
            //         isMaxCapacityTwo: true,
            //     },
            // },
            // userRelation: {
            //     connect: {
            //         username: 'exampleUser',
            //     },
            // },
        },
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
