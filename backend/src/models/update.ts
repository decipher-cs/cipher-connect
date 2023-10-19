import { Room, User, UserRoom } from '@prisma/client'
import { prisma } from '../server.js'
import { UserWithoutID } from '../types.js'

export const updateUser = async (username: string, user: Partial<UserWithoutID>) => {
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

export const updateRoomParticipants = async (roomId: Room['roomId'], participantsUsernames: User['username'][]) => {
    const usernameObj = participantsUsernames.map(username => ({ username }))

    const updatedRoom = await prisma.room.update({
        where: { roomId },
        data: {
            user: { connect: usernameObj },

            userRoomConfig: {
                connectOrCreate: participantsUsernames.map(username => ({
                    where: { username_roomId: { username, roomId } },
                    create: { username },
                })),
            },

            userRoom: {
                connectOrCreate: participantsUsernames.map(username => ({
                    where: { username_roomId: { username, roomId } },
                    create: { username },
                })),
            },
        },
    })
    return updatedRoom.roomId
}

export const updateMessageReadStatus = async (
    roomId: Room['roomId'],
    hasUnreadMessages: UserRoom['hasUnreadMessages'],
    usernames?: User['username'][]
) => {
    await prisma.userRoom.updateMany({
        where: {
            roomId,
            username: usernames ? { in: usernames } : undefined,
        },
        data: { hasUnreadMessages },
    })
    // await prisma.userRoom.updateMany({
    //     where: {
    //         roomId,
    //         username: { in: usernames },
    //     },
    //     data: { hasUnreadMessages },
    // })
}
