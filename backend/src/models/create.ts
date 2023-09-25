import { PrismaClient, Prisma, MessageContentType, Message, User, Room } from '@prisma/client'
import { prisma } from '../server.js'

export const createNewUser = async (username: string, passwordHash: string) => {
    try {
        const returnedData = await prisma.user.create({
            data: {
                username,
                displayName: username,
            },
        })
        await prisma.passwordHash.create({
            data: {
                username,
                hash: passwordHash,
            },
        })
        return returnedData
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') return null
        }
        throw err
    }
}


export const addRefreshToken = async (username: string, token: string) => {
    const refreshToken = await prisma.refreshToken.create({ data: { username, tokenValue: token } })
    return refreshToken
}
export const createRoomForTwo = async (participant1: string, participant2: string) => {
    return await prisma.room.create({
        data: {
            isMaxCapacityTwo: true,
            participants: {
                createMany: { skipDuplicates: true, data: [{ username: participant1 }, { username: participant2 }] },
            },
        },
    })
}
export const addParticipantsToPrivateRoom = async (participant1: string, participant2: string, roomId: string) => {
    return prisma.userRoomParticipation.createMany({
        data: [
            { username: participant1, roomId },
            { username: participant2, roomId },
        ],
    })
}
export const createRoomForMany = async (roomDisplayName: string) => {
    return prisma.room.create({
        data: {
            roomDisplayName,
            isMaxCapacityTwo: false,
        },
    })
}
export const createGroup = async (participants: string[], roomDisplayName: string) => {
    const usernames = participants.map(username => ({ username }))
    return await prisma.room.create({
        data: {
            isMaxCapacityTwo: false,
            roomDisplayName,
            participants: {
                createMany: { skipDuplicates: true, data: usernames },
            },
        },
    })
}
export const addMessageToDB = async (message: Message) => {
    return await prisma.message.create({ data: message })
}
