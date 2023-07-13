// Model interactes with the database (mySQL) //

import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export const createNewUser = async (username: string, passwordHash: string) => {
    try {
        const returnedData = await prisma.user.create({
            data: {
                username,
                // passwordHash,
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

// Deprecating this in favour of getAllUserRooms
// export const getUserAndUserRoomsFromDB = async (username: string) => {
//     const rooms = await prisma.roomConfig.findMany({
//         where: { userUsername: username },
//         include: { roomIdRelation: true },
//     })
//
//     return rooms
// }
export const getAllUserRooms = async (username: string) => {
    return await prisma.userRoomParticipation.findMany({
        where: { username },
    })
}

// Deprecating this in favour of ?___?
// export const getUserRoomsFromDB = async (username: string) => {
//     const rooms = await getUserAndUserRoomsFromDB(username)
//
//     return rooms
// }

// Deprecating this in favour of createRoomForTwo, createPrivateRoomAndAddParticipants, and createRoomForTwo
// export const createPrivateRoom = async (participant1: string, participant2: string) => {
//     // const room = await prisma.userRoomConfig.createMany({
//     //     data: [{ roomId: 'fawe', userUsername: 'afwe' }],
//     // })
//     const room = await prisma.userRoomConfig.createMany({
//         data: {
//             // roomIdRelation: {
//             //     create: {
//             //         roomDisplayName: `${participant1}-${participant2}`.slice(0, 33),
//             //         isMaxCapacityTwo: true,
//             //     },
//             // },
//             // userRelation: {
//             //     connect: {
//             //         username: 'exampleUser',
//             //     },
//             // },
//         },
//     })
//
//     return room
// }
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
    addParticipantsToPrivateRoom(participant1, participant2, roomDetails.roomId)
}

// Deprecating this in favour of createRoomForMany, addParticipantsToGroup, and createGroupAndAddParticipantsToGroup
// export const createGroup = async (participantsUsernames: string[], roomDisplayName: string) => {
//     if (participantsUsernames.length === 0) return undefined
//
//     const participantsUsernamesObj = participantsUsernames.map(username => ({ username }))
//
//     const group = await prisma.room.create({
//         data: {
//             roomDisplayName,
//             isMaxCapacityTwo: false,
//             participants: { connect: participantsUsernamesObj },
//         },
//         include: { participants: true },
//     })
//
//     return group
// }

export const createRoomForMany = async () => {
    return prisma.room.create({
        data: {
            roomDisplayName: 'Group',
            isMaxCapacityTwo: false,
        },
    })
}

export const addParticipantsToGroup = async (participants: string[], roomId: string) => {
    const usernameWithRoomId = participants.map(username => ({ username, roomId }))
    return await prisma.userRoomParticipation.createMany({ data: usernameWithRoomId })
}

export const createGroupAndAddParticipantsToGroup = async (participants: string[]) => {
    const room = await createRoomForMany()
    return addParticipantsToGroup(participants, room.roomId)
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

// This will be kept in stasis until its use is found
// export const removeParticipantFromRoom = async (roomId: string, participantUsername: string) => {
//     const room = await prisma.room.update({
//         where: {
//             roomId,
//         },
//         data: {
//             participants: { disconnect: { username: participantUsername } },
//         },
//         include: { participants: true },
//     })
//     return room
// }
