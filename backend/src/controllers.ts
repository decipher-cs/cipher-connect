import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs/promises'
import { NextFunction, Request, Response } from 'express'
import {
    deleteRefreshToken,
    getAllMessagesFromRoom,
    getAllRoomPariticpants,
    getRefreshToken,
    getUserFromDB,
    getUserRooms,
    getUserRoomsAlongParticipants,
    getUsersFromDB,
    updateRoom,
    updateRoomImage,
    updateUser,
} from './model.js'
import { addRefreshToken, createNewUser, getUserHash } from './model.js'
import { createAccessToken, createRefreshToken } from './middleware/jwtFunctions.js'

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
            console.log('decoded str is:', decode)
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

    if (username) updateUser(username, { avatarPath: filename })
    else if (roomId) updateRoom(roomId, { roomDisplayImagePath: filename })
    else {
        res.sendStatus(400)
        return
    }

    res.json(filename)
    return
}

export const returnUser = async (req: Request, res: Response) => {
    let { username } = req.params
    try {
        const user = await getUserFromDB(username)
        res.send(user)
    } catch (err) {
        res.sendStatus(400)
    }
    return
}
export const returnUsers = async (req: Request, res: Response) => {
    let { usernames } = req.query as { usernames: string[] | string }
    console.log(usernames, typeof usernames)
    try {
        if (!usernames) throw new Error('Expected array')

        if (typeof usernames === 'string') usernames = [usernames]

        if (Array.isArray(usernames) === false) throw new Error('Expected array')

        const users = await getUsersFromDB(usernames)

        res.send(users)
    } catch (err) {
        res.sendStatus(400)
    }
    return
}

export const returnUserRooms = async (req: Request, res: Response) => {
    const { username } = req.params

    if (username === undefined) {
        res.sendStatus(400)
        return
    }

    const rooms = await getUserRoomsAlongParticipants(username)

    res.send(rooms)
    return
}

export const fetchAllRoomPariticpants = async (req: Request, res: Response) => {
    const { roomId } = req.body
    if (roomId === undefined) {
        res.sendStatus(400)
        return
    }
    const participants = await getAllRoomPariticpants(roomId)
    if (participants === undefined) {
        res.sendStatus(400)
    } else res.send(participants)
    return
}

export const fetchMessages = async (req: Request, res: Response) => {
    const { roomID } = req.params
    const messages = await getAllMessagesFromRoom(roomID)
    if (messages === undefined) res.sendStatus(404)
    else res.send(messages)
}
