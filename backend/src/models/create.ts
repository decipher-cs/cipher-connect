import { Message } from '@prisma/client'
import { prisma } from '../server.js'
import { User } from '../types.js'

export const createNewUser = async (username: string, passwordHash: string): Promise<User | null> => {
    try {
        const result = await prisma.user.create({
            data: { username, passwordHash, displayName: username },
            select: {
                passwordHash: false,
                userId: false,

                username: true,
                createTime: true,
                displayName: true,
                avatarPath: true,
                status: true,
            },
        })
        return result
    } catch (err) {
        // if (err instanceof Prisma.PrismaClientKnownRequestError) {
        //     "Unique constraint failed on the {constraint}"
        //     if (err.code === 'P2002') return null
        // }
        console.log('error encountered while creating new user', err)
        return null
    }
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
    const room = await prisma.room.create({
        data: {
            roomType: 'private',
            user: { connect: [{ username: participant1 }, { username: participant2 }] },
            userRoom: {
                createMany: {
                    data: [{ username: participant1 }, { username: participant2 }],
                },
            },
        },
        select: { roomId: true },
    })
    return room.roomId
}

export const createGroup = async (usernames: User['username'][], roomDisplayName: string) => {
    const room = await prisma.room.create({
        data: {
            roomDisplayName,
            roomType: 'group',
            user: {
                connect: usernames.map(username => ({ username })),
            },
            userRoom: {
                createMany: {
                    data: usernames.map(username => ({ username })),
                },
            },
        },
        include: { user: true },
    })
    return room.roomId
}

export const addMessageToDB = async (message: Message) => {
    return await prisma.message.create({ data: message })
}
