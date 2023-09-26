import { Room, User } from '@prisma/client'
import { prisma } from '../server.js'

export const updateUser = async (username: string, user: Partial<User>) => {
    return await prisma.user.update({ where: { username }, data: { ...user } })
}

export const updateRoom = async (roomId: string, room: Partial<Room>) => {
    return await prisma.room.update({
        where: { roomId },
        data: { ...room },
    })
}

export const updateRoomImage = async (roomId: string, pathToImg: string) => {
    return await prisma.room.update({
        where: { roomId },
        data: { roomAvatar: pathToImg },
    })
}
