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

export const createUserRoom = async (username: string, roomId: string) => {
    return await prisma.userRoom.create({
        data: {
            roomId,
            username,
        },
    })
}

export const createPrivateRoom = async (participant1: string, participant2: string) => {
    return await prisma.room.create({
        data: {
            roomType: 'private',
            user: { connect: [{ username: participant1 }, { username: participant2 }] },
            userRoomConfig: {
                createMany: {
                    data: [{ username: participant1 }, { username: participant2 }],
                },
            },
            userRoom: {
                createMany: {
                    data: [{ username: participant1 }, { username: participant2 }],
                },
            },
        },
    })
}

export const createGroup = async (usernames: User['username'][], roomDisplayName: string) => {
    return prisma.room.create({
        data: {
            roomDisplayName,
            roomType: 'group',
            user: {
                connect: usernames.map(username => ({ username })),
            },
            userRoomConfig: {
                createMany: {
                    data: usernames.map(username => ({ username })),
                },
            },
            userRoom: {
                createMany: {
                    data: usernames.map(username => ({ username })),
                },
            },
        },
    })
}

export const addMessageToDB = async (message: Message) => {
    return await prisma.message.create({ data: message })
}
