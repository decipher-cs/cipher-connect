import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { createAccessToken, createRefreshToken } from './middleware/jwtFunctions.js'
import {
    checkIfUserExists,
    getMessagesFromRoom,
    getRefreshToken,
    getRoomDetails,
    getRoomPariticpants,
    getUniqueRoomDetails,
    getUser,
    getUserHash,
    getUsers,
} from './models/find.js'
import { addRefreshToken, createGroup, createNewUser, createPrivateRoom } from './models/create.js'
import { deleteRefreshToken, deleteRoom, deleteUserRoom } from './models/delete.js'
import {
    updateMessageReadStatus,
    updateRoom,
    updateRoomConfig,
    updateRoomParticipants,
    updateUser,
} from './models/update.js'
import { RoomDetails, UserWithoutID } from './types.js'
import { createUploadthing, FileRouter, createServerHandler, UTApi } from 'uploadthing/server'
import { RoomConfig } from '@prisma/client'

const utapi = new UTApi()

interface LoginCredentials {
    username: string
    password?: string
}

export const loginUser = async (req: Request, res: Response) => {
    const { username, password }: LoginCredentials = req.body

    const hash = await getUserHash(username) // get password hash from DB

    if (hash === null || password === undefined) {
        res.status(401).end('Invalid username or password')
        return
    }

    // const isPasswordCorrect = await bcrypt.compare(password, hash.passwordHash) // #Fix
    const isPasswordCorrect = true

    if (isPasswordCorrect !== true) {
        res.status(401).end('Invalid username or password')
        return
    }

    const accessToken = createAccessToken({ username }) // call JWT to create token

    const refreshToken = createRefreshToken({ username }) // call JWT to create another token

    addRefreshToken(username, refreshToken) // Add refresh token to database

    res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24,
    })

    res.json(accessToken)

    return
}

// User sign-up
export const createUser = async (req: Request, res: Response) => {
    let { username, password }: LoginCredentials = req.body

    if (password === undefined) {
        res.status(401).end('Invalid username or password')
        return
    }

    const passwordHash = await bcrypt.hash(password, 10) // hash password

    const newUserDetails = await createNewUser(username, passwordHash) // put hash and username in DB

    if (newUserDetails === null) {
        // check for username collision
        res.status(409).end('username taken')
        return
    }

    res.sendStatus(200)

    return
}

export const varifyRefreshToken = async (req: Request, res: Response) => {
    const refreshToken: string | undefined = req.cookies?.refreshToken

    const { username }: LoginCredentials = req.body

    if (refreshToken === undefined) {
        res.sendStatus(401)
        return
    }

    const tokenFromDB = await getRefreshToken(username)

    if (tokenFromDB.includes(refreshToken) === false) {
        res.sendStatus(401)
        return
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err !== null) {
            console.log(err)
            res.sendStatus(403)
            return
        } else if (err === null) {
            res.json({ username }).end()
            return
        }
        res.sendStatus(500)
        return
    })
}

export const renewAccessToken = async (req: Request, res: Response) => {
    const refreshToken: string | undefined = req.cookies?.refreshToken

    //set password to be optional in ts
    let { username, password }: LoginCredentials = req.body

    if (refreshToken === undefined) {
        res.send(401).end('undefined refreshtoken')
        return
    }

    const refrestTokensFromDB = await getRefreshToken(username)

    if (refrestTokensFromDB.includes(refreshToken) === false) {
        res.send(401).end('not in db')
        return
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err === null) {
            const newAccessToken = createAccessToken({ username })
            res.json(newAccessToken)
            return
        }
        // console.log('ERRIS ->>', err)
        res.sendStatus(403)
        return
    })
}

export const logoutUser = async (req: Request, res: Response) => {
    const { username }: LoginCredentials = req.body

    deleteRefreshToken(username)

    res.sendStatus(200)
}

export const storeMediaToFS = async (req: Request, res: Response) => {
    if (req.file === undefined) {
        res.sendStatus(400)
        return
    }

    const { filename }: Express.Multer.File = req.file
    console.log(filename)
    // utapi.uploadFilesFromUrl('http://localhost:8080/public/media/' + filename)

    res.json(filename)
    return
}

export const storeAvatarToFS = async (req: Request, res: Response) => {
    const { username, roomId } = req.body

    if (req.file === undefined) {
        res.sendStatus(400)
        return
    }

    const { filename }: Express.Multer.File = req.file

    if (username) await updateUser(username, { avatarPath: filename })
    else if (roomId) {
        const room = await updateRoom(roomId, { roomAvatar: filename })
        console.log(room)
    } else {
        res.sendStatus(400)
        return
    }

    res.json(filename)
    return
}

export const returnUser = async (req: Request, res: Response) => {
    let { username } = req.params
    if (username === undefined) {
        res.sendStatus(400)
        return
    }

    try {
        const user = await getUser(username)
        if (user === null) throw new Error('no user found with that username')
        res.send(user)
    } catch (err) {
        res.sendStatus(400)
    }
    return
}
export const returnUsers = async (req: Request, res: Response) => {
    const { usernames } = req.query as { usernames: string[] }

    try {
        if (!usernames || Array.isArray(usernames) === false) throw new Error('Expected array')

        const users = await getUsers(usernames)

        res.send(users)
    } catch (err) {
        res.sendStatus(400)
    }
    return
}

export const fetchMessages = async (req: Request, res: Response) => {
    const { roomId } = req.params
    if (roomId === undefined) {
        res.sendStatus(400)
        return
    }
    const messages = await getMessagesFromRoom(roomId)
    if (messages === undefined) {
        res.sendStatus(400)
    } else res.send(messages)
    return
}

export const fetchRoomPariticpants = async (req: Request, res: Response) => {
    const { roomId } = req.body
    if (roomId === undefined) {
        res.sendStatus(400)
        return
    }
    const participants = await getRoomPariticpants(roomId)
    if (participants === undefined) {
        res.sendStatus(400)
    } else res.send(participants)
    return
}

export const handleGettingRoomDetails = async (req: Request, res: Response) => {
    const { username } = req.params

    if (username === undefined) {
        res.sendStatus(400)
        return
    }

    const rooms = await getRoomDetails({ username })

    res.send(rooms)
}
export const handleGettingUniqueRoomDetails = async (req: Request, res: Response) => {
    const { username, roomId } = req.params

    if (username === undefined) {
        res.sendStatus(400)
        return
    }

    try {
        const room = await getUniqueRoomDetails(username, roomId)
        res.send(room)
    } catch (err) {
        res.sendStatus(400)
    }
    return
}

export const handlePrivateRoomCreation = async (req: Request, res: Response) => {
    const { participants }: { participants: [string, string] } = req.body

    if (participants.length !== 2) {
        res.sendStatus(400)
        return
    }

    try {
        const roomId = await createPrivateRoom(...participants)
        // const roomDetails: RoomDetails[] = await getRoomDetails(roomId)
        res.send(roomId)
    } catch (err) {
        res.sendStatus(400)
    }
}

export const handleGroupCreation = async (req: Request, res: Response) => {
    const { participants, roomDisplayName }: { participants: [string, string]; roomDisplayName: string } = req.body

    if (participants.length < 2) {
        res.sendStatus(400)
        return
    }

    try {
        const roomId = await createGroup(participants, roomDisplayName)
        // const roomDetails: RoomDetails[] = await getRoomDetails(roomId)
        res.send(roomId)
    } catch (err) {
        res.sendStatus(400)
    }
}

export const handleUserDeletesRoom = async (req: Request, res: Response) => {
    const { roomId } = req.params
    if (!roomId) {
        res.sendStatus(400)
        return
    }
    try {
        const removedUserRoom = await deleteRoom(roomId)
    } catch (err) {}
    res.sendStatus(200)
}

export const handleUserLeavesRoom = async (req: Request, res: Response) => {
    const { username, roomId } = req.params
    if (!username || !roomId) {
        res.sendStatus(400)
        return
    }
    try {
        const removedUserRoom = await deleteUserRoom(username, roomId)
    } catch (err) {}
    res.sendStatus(200)
}

export const handleUserExistsCheck = async (req: Request, res: Response) => {
    const { username } = req.params
    const userExists = await checkIfUserExists(username)
    res.send(userExists)
}
export const handleNewParticipants = async (req: Request, res: Response) => {
    type Body = { roomId: string; participants: string[] }

    const { roomId, participants }: Body = req.body

    try {
        await updateRoomParticipants(roomId, participants)
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(400)
    }
    return
}

export const handleMessageReadStatusChange = async (req: Request, res: Response) => {
    const { roomId, username } = req.params
    const { hasUnreadMessages }: { hasUnreadMessages: boolean } = req.body
    try {
        if (!roomId || !username || hasUnreadMessages === undefined) throw new Error('Incorrect params')

        await updateMessageReadStatus(roomId, hasUnreadMessages, [username])

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(400)
    }
}

export const handleUserProfileUpdation = async (req: Request, res: Response) => {
    const { status, displayName, username }: Partial<Pick<UserWithoutID, 'displayName' | 'username' | 'status'>> =
        req.body
    const { buffer } = req.file ?? { buffer: undefined }
    let avatarPath: string | undefined

    try {
        if (!username) throw new Error('No username provided while updating profile')

        if (buffer) {
            const blob = new Blob([buffer])

            const { data, error } = await utapi.uploadFiles(blob)

            if (error || !data) throw new Error('Error uploading file')

            avatarPath = data.url
        }

        await updateUser(username, { displayName, status, avatarPath })

        res.sendStatus(200)
    } catch (err) {
        console.log('errr', err)
        res.sendStatus(400)
    }
}

export const handleMediaUpload = async (req: Request, res: Response) => {
    try {
        if (!req.file) throw new Error('no file to upload')

        const { buffer, mimetype, originalname, size } = req.file

        if (!buffer) throw new Error('empty buffer for file')

        const blob = new Blob([buffer], { type: mimetype })

        const { data, error } = await utapi.uploadFiles(blob, { mimetype, name: originalname })

        if (error || !data) throw new Error('Error uploading file')

        res.send(data.url)
    } catch (err) {
        res.sendStatus(400)
        throw err
    }
}

export const handleAvatarChange = async (req: Request, res: Response) => {
    const { username, roomId } = req.body

    try {
        if (!req.file) throw new Error('no file to upload')

        const { buffer, mimetype, originalname, size } = req.file

        if (!buffer) throw new Error('empty buffer for file')

        const blob = new Blob([buffer], { type: mimetype })

        const { data, error } = await utapi.uploadFiles(blob, { mimetype, name: originalname })

        if (error || !data) throw new Error('Error uploading file')

        if (username) await updateUser(username, { avatarPath: data.url })
        else if (roomId) await updateRoom(roomId, { roomAvatar: data.url })
        else throw new Error()

        res.json(data.url)
    } catch (err) {
        res.sendStatus(400)
    }
}

export const handleRoomConfigChange = async (req: Request, res: Response) => {
    const { username, roomId, ...newConfig }: RoomConfig = req.body

    const changedConfig = await updateRoomConfig(roomId, username, newConfig)
    res.json(changedConfig)
}

export const test = async (req: Request, res: Response) => {
    console.log('test point hit')
    res.sendStatus(200)
}
