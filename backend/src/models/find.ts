import { Message, Room, UserMessage, UserRoom } from '@prisma/client'
import { prisma } from '../server.js'
import { MessageWithOptions, RoomDetails, User } from '../types.js'

export const getUser = async (username: string): Promise<User | null> => {
    try {
        const res = await prisma.user.findUnique({
            where: { username },
            select: {
                userId: false,
                passwordHash: false,
                username: true,
                createTime: true,
                displayName: true,
                avatarPath: true,
                status: true,
            },
        })
        return res
    } catch (err) {
        return null
    }
}

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const user = await prisma.user.findUnique({
            where: { userId },
            select: {
                userId: false,
                passwordHash: false,
                username: true,
                status: true,
                createTime: true,
                displayName: true,
                avatarPath: true,
            },
        })

        return user
    } catch (err) {
        return null
    }
}

export const getUsersById = async (userIDs: string[]): Promise<User[] | null> => {
    try {
        return await prisma.user.findMany({
            where: {
                userId: { in: userIDs },
            },
            select: {
                userId: false,
                passwordHash: false,
                username: true,
                status: true,
                createTime: true,
                displayName: true,
                avatarPath: true,
            },
        })
    } catch (err) {
        return null
    }
}

export const getUsers = async (usernames: string[]): Promise<User[] | null> => {
    return await prisma.user.findMany({
        where: {
            username: { in: usernames },
        },
        select: {
            userId: false,
            passwordHash: false,
            username: true,
            createTime: true,
            displayName: true,
            avatarPath: true,
            status: true,
        },
    })
}

export const checkIfUserExists = async (username: User['username']): Promise<boolean> => {
    try {
        const user = await prisma.user.count({ where: { username } })
        return user === 1
    } catch (err) {
        return false
    }
}

export const getRoomPariticpants = async (roomId: string): Promise<User[] | null> => {
    try {
        const result = await prisma.room.findUnique({
            where: { roomId },
            select: { user: true },
        })
        return result?.user ?? null
    } catch (error) {
        return null
    }
}

export const getRoomPariticpantsUsernames = async (roomId: string): Promise<User['username'][] | null> => {
    try {
        const result = await prisma.room.findUnique({
            where: { roomId },
            select: { user: { select: { username: true } } },
        })
        return result?.user.map(usr => usr.username) ?? null
    } catch (error) {
        return null
    }
}

export const getMessagesFromRoom = async (
    roomId: string,
    username: User['username'],
    cursor?: string,
    take?: number
): Promise<Message[] | null> => {
    try {
        const messages = await prisma.message.findMany({
            where: { roomId },
            orderBy: { createdAt: 'desc' },
            include: {
                userMessage: {
                    where: { AND: [{ username }] },
                },
            },

            cursor: cursor ? { key: cursor } : undefined,
            take,
            skip: cursor ? 1 : 0,
        })

        const userMessages = await prisma.userMessage.findMany({
            where: { AND: [{ username }], OR: messages.map(msg => ({ messageKey: msg.key })) },
        })

        return messages.map(message => {
            let messageOptions = userMessages.find(userMsg => {
                userMsg.messageKey === message.key
            })

            if (!messageOptions)
                messageOptions = {
                    messageKey: message.key,
                    username: message.senderUsername,
                    isHidden: false,
                    isNotificationMuted: false,
                    isMarkedFavourite: false,
                    isPinned: false,
                }

            return {
                ...message,
                messageOptions,
            } satisfies MessageWithOptions
        }) satisfies MessageWithOptions[]
    } catch (error) {
        return null
    }
}

export const checkIfPrivateRoomExists = async (userA: string, userB: string) => {
    return await prisma.room.findFirst({
        where: {
            AND: [
                { roomType: 'private' },
                { user: { some: { username: userA } } },
                { user: { some: { username: userB } } },
            ],
        },
    })
}

export const getUserHash = async (username: string): Promise<null | string> => {
    try {
        const hash = await prisma.user.findUnique({
            where: { username },
            select: { passwordHash: true },
        })
        return hash?.passwordHash ?? null
    } catch (err) {
        return null
    }
}

export const getRoomsByUsername = async (username: string): Promise<null | Room[]> => {
    try {
        const res = await prisma.user.findFirst({
            where: { username },
            select: { rooms: true },
        })
        return res?.rooms ?? null
    } catch (error) {
        return null
    }
}

export const getRoomIDsByUsername = async (username: string): Promise<null | Room['roomId'][]> => {
    try {
        const rooms = await prisma.user.findUnique({
            where: { username },
            select: { rooms: { select: { roomId: true } } },
        })
        return rooms?.rooms.map(room => room.roomId) ?? null
    } catch (error) {
        return null
    }
}

export const getUserRoom = async (username: User['username'], roomId: Room['roomId']): Promise<UserRoom | null> => {
    try {
        return await prisma.userRoom.findUnique({
            where: { username_roomId: { username, roomId } },
        })
    } catch (error) {
        return null
    }
}

export const getManyRoomDetails = async (
    id: { username: User['username'] } | { roomId: Room['roomId'] }
): Promise<RoomDetails[] | null> => {
    try {
        const rooms = await prisma.userRoom.findMany({
            where: id,
            include: { room: { include: { user: { select: { username: true } } } } },
        })

        return rooms.map(room => {
            const {
                room: { user, ...roomWithoutUser },
                ...userRoom
            } = room
            return {
                ...userRoom,
                ...roomWithoutUser,
                participants: user.map(usr => usr.username),
            } satisfies RoomDetails
        })
    } catch (err) {
        console.log('Error while fetching user rooms', err)
        return null
    }
}

export const getSingleRoomDetails = async (
    username: User['username'],
    roomId: Room['roomId']
): Promise<RoomDetails | null> => {
    try {
        const room = await prisma.userRoom.findUnique({
            where: { username_roomId: { username, roomId } },
            include: {
                room: {
                    include: {
                        user: true,
                    },
                },
            },
        })

        if (room === null) return null

        const {
            room: { user, ...roomWithoutUser },
            ...userRoom
        } = room
        return {
            ...userRoom,
            ...roomWithoutUser,
            participants: user.map(usr => usr.username),
        } satisfies RoomDetails
    } catch (error) {
        return null
    }
}

export const getMessageCount = async (roomId: Room['roomId']): Promise<number | null> => {
    try {
        const messsageCount = await prisma.message.count({ where: { roomId } })
        return messsageCount
    } catch (err) {
        console.log('Error while fetching user rooms', err)
        return null
    }
}
