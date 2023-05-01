import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { createNewUser, getUserHash } from './model.js'
import jwt from 'jsonwebtoken'

interface LoginCredentials {
    username: string
    password: string
}

export const loginUser = async (req: Request, res: Response) => {
    const { username, password }: LoginCredentials = req.body

    const hash = await getUserHash(username)

    if (hash === null) {
        res.status(401).end('Invalid username or password')
        return
    }

    const isPasswordCorrect = await bcrypt.compare(password, hash.password_hash)

    if (isPasswordCorrect === false) {
        res.status(401).end('Invalid username or password')
        return
    }
    
    const accessToekn = jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20s'})
    console.log('at:',accessToekn)

    res.status(200).end(String(isPasswordCorrect))
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
