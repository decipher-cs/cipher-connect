import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { addRefreshToken, createNewUser, getUserHash } from './model.js'
import jwt from 'jsonwebtoken'
import cookieParser, { CookieParseOptions } from 'cookie-parser'
import { retrieveRefreshToken } from './model.js'

interface LoginCredentials {
    username: string
    password: string
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: LoginCredentials = req.body

    console.log(username, password)
    const hash = await getUserHash(username)

    if (hash === null) {
        res.status(401).end('Invalid username or password')
        return
    }

    const isPasswordCorrect = await bcrypt.compare(password, hash.passwordHash)

    if (isPasswordCorrect === false) {
        res.status(401).end('Invalid username or password')
        return
    }

    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' })

    const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' })

    addRefreshToken(username, refreshToken)

    res.cookie('token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 30 })

    console.log(refreshToken)

    res.json(accessToken)

    // res.status(200).end('Login successful')

    return
}

export const createUser = async (req: Request, res: Response) => {
    let { username, password }: LoginCredentials = req.body

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await createNewUser(username, passwordHash)

    if (newUser === null) {
        res.status(409).end('username taken')
        return
    }

    console.log('new user is:', newUser)

    res.status(200).end()
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
            const newAccessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET)
            res.json(newAccessToken)
            return
        }
        console.log('ERRIS ->>', err)
        res.sendStatus(403)
        return
    })
}
