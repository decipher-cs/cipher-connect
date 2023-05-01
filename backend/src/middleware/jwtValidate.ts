import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const jwtValidate = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    console.log('authyisdfo', req.headers['authorization'])
    if (authorization === undefined) {
        res.sendStatus(401)
        return
    }

    const token = authorization.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err === null) {
            next()
        }
        console.log('ERRIS:', err)
        res.sendStatus(403)
    })
}

// export const isJwtValid = (token: string, secret: string) => {
//     const f = jwt.verify(token, secret)
// }
