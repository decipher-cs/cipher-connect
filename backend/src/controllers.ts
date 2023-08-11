import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { deleteRefreshToken, getRefreshToken, updateRoomImage } from './model.js'
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

export const updateGroupImage = async (req: Request, res: Response) => {
    if (req.file === undefined || req.body.roomId === undefined) {
        res.sendStatus(400)
        return
    }
    const file = req.file.buffer
    const roomId: string = req.body.roomId
    try {
        const room = await updateRoomImage(roomId, file)
        res.send(room.roomDisplayImage)
    } catch (err) {
        res.sendStatus(500)
    }
    return
}
