import { Message, Room, User } from '@prisma/client'
import { prisma } from '../server.js'

export const deleteAllUsers = async () => {
    const deletedUsers = await prisma.user.deleteMany()
    return deletedUsers
}

export const deleteRefreshToken = async (username: string) => {
    const removedCount = await prisma.refreshToken.deleteMany({ where: { username } })
    return removedCount
}

export const deleteRoom = async (roomId: Room['roomId']) => {
    const room = await prisma.room.delete({ where: { roomId } })
    return room
}

export const deleteUserRoom = async (username: User['username'], roomId: Room['roomId']) => {
    const removedUserRoom = await prisma.userRoom.delete({
        where: {
            username_roomId: {
                roomId,
                username,
            },
        },
    })
    const removedConfig = await prisma.roomConfig.delete({
        where: {
            username_roomId: {
                roomId,
                username,
            },
        },
    })
    const room = await prisma.room.update({
        where: { roomId },
        data: {
            user: {
                disconnect: { username },
            },
        },
    })
    const user = await prisma.user.update({
        where: { username },
        data: {
            rooms: {
                disconnect: { roomId },
            },
        },
    })
    return removedUserRoom
}

export const deleteMessage = async (messageKey: Message['key']): Promise<boolean> => {
    try {
        await prisma.message.delete({ where: { key: messageKey }, select: { key: true } })
        return true
    } catch (err: any) {
        if ('code' in err && err?.code === 'P2025') return true
        console.log(err)
        return false
    }
}
