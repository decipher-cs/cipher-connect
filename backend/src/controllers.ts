import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { deleteRefreshToken, retrieveRefreshToken } from './model.js'
import { NextFunction, Request, Response } from 'express'
import { addRefreshToken, createNewUser, getUserHash } from './model.js'
import { createAccessToken, createRefreshToken } from './middleware/jwtFunctions.js'

interface LoginCredentials {
    username: string
    password?: string
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: LoginCredentials = req.body

    console.log(username, password)
    const hash = await getUserHash(username)

    if (hash === null || password === undefined) {
        res.status(401).end('Invalid username or password')
        return
    }

    const isPasswordCorrect = await bcrypt.compare(password, hash.passwordHash)

    if (isPasswordCorrect === false) {
        res.status(401).end('Invalid username or password')
        return
    }

    const accessToken = createAccessToken({ username })

    const refreshToken = createRefreshToken({ username })

    addRefreshToken(username, refreshToken)

    res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 30 })

    res.json(accessToken)

    return
}

export const createUser = async (req: Request, res: Response) => {
    let { username, password }: LoginCredentials = req.body

    if (password === undefined) {
        res.status(401).end('Invalid username or password')
        return
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUserDetails = await createNewUser(username, passwordHash)

    if (newUserDetails === null) {
        res.status(409).end('username taken')
        return
    }

    res.sendStatus(200)
    return
}

export const renewAccessToken = async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies?.token

    //set password to be optional in ts
    let { username, password }: LoginCredentials = req.body

    if (refreshToken === undefined) {
        res.send(401).end('undefined refreshtoken')
        return
    }

    const refrestTokensFromDB = await retrieveRefreshToken(username).then(data =>
        data.map(({ tokenValue }) => tokenValue)
    )

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
    await deleteRefreshToken(username)
    res.sendStatus(200)
}
