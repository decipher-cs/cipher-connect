import { hash } from 'bcrypt'
import { Request, Response } from 'express'

interface LoginCredentials {
    username: string
    password: string
}

export const loginUser = async (req: Request, res: Response) => {
    const reqBody: LoginCredentials = req.body
    console.log(reqBody.password)
    // hash('hello world', 15, (err, hash)=>{console.log('hash is', hash)})
    res.status(200).end()
}
