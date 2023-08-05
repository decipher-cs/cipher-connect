// Model interactes with the database (mySQL) //

import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export const createNewUser = async (username: string, passwordHash: string) => {
    try {
        const returnedData = await prisma.user.create({
            data: {
                username,
                // passwordHash,
                userDisplayName: username,
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

export const getRoomDetailsWithParticipants = async (roomId: string) => {
    return await prisma.room.findUnique({
        where: {
            roomId,
        },
        include: {
            participants: {
                select: {
                    key: true,
                    username: true,
                },
            },
        },
    })
}

export const getRoomsContainingUser = async (username: string) => {
    return await prisma.room.findMany({
        where: { participants: { some: { username } } },
    })
}

export const getRoomsContainingUserWithRoomParticipants = async (username: string) => {
    const rooms = await prisma.userRoomParticipation.findMany({
        where: { username },
        select: {
            roomId: true,
            roomIdRelation: {
                select: {
                    roomDisplayName: true,
                    roomDisplayImage: true,
                    participants: {
                        select: {
                            username: true,
                        },
                    },
                    isMaxCapacityTwo: true,
                },
            },
        },
    })
    return rooms.map(
        ({ roomId, roomIdRelation: { participants, isMaxCapacityTwo, roomDisplayName, roomDisplayImage } }) => ({
            roomId,
            roomDisplayImage,
            roomDisplayName,
            isMaxCapacityTwo,
            participants,
        })
    )
}

export const createRoomForTwo = async () => {
    return prisma.room.create({
        data: {
            roomDisplayName: 'Private Room',
            isMaxCapacityTwo: true,
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

export const createPrivateRoomAndAddParticipants = async (participant1: string, participant2: string) => {
    const roomDetails = await createRoomForTwo()
    await addParticipantsToPrivateRoom(participant1, participant2, roomDetails.roomId)
    return await getRoomDetailsWithParticipants(roomDetails.roomId)
}

export const createRoomForMany = async (roomDisplayName: string) => {
    return prisma.room.create({
        data: {
            roomDisplayName,
            isMaxCapacityTwo: false,
        },
    })
}

export const addParticipantsToGroup = async (participants: string[], roomId: string) => {
    const usernameWithRoomId = participants.map(username => ({ username, roomId }))
    await prisma.userRoomParticipation.createMany({ data: usernameWithRoomId })
    return await getRoomDetailsWithParticipants(roomId)
}

export const createGroupAndAddParticipantsToGroup = async (participants: string[], groupDisplayName: string) => {
    const room = await createRoomForMany(groupDisplayName)
    await addParticipantsToGroup(participants, room.roomId)
    return await getRoomDetailsWithParticipants(room.roomId)
}

export const addMessageToDB = async (msgSender: string, roomId: string, textContent: string) => {
    return await prisma.message.create({
        data: {
            senderUsername: msgSender,
            roomId,
            content: textContent,
        },
    })
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

export const updateUserSettings = async (
    username: string,
    userDisplayName: string | undefined,
    userDisplayImage: Buffer | null | undefined
) => {
    return await prisma.user.update({
        where: { username },
        data: {
            userDisplayName,
            userDisplayImage,
        },
        select: {
            userDisplayName: true,
            userDisplayImage: true,
        }
    })
}

export const getUserSettings = async (username: string) => {
    return await prisma.user.findFirstOrThrow({
        where: { username },
        select: {
            userDisplayName: true,
            userDisplayImage: true,
        },
    })
}
