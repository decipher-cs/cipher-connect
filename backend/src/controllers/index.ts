import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { getUserHash } from '../model.js'

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

    res.status(200).end(isPasswordCorrect)
}
