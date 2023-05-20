import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

type TokenType = 'refresh' | 'access'

// check if refresh/access token is valid
export const isTokenValid = (token: string, tokenAccessOrRefresh: TokenType) => {
    const tokenType =
        tokenAccessOrRefresh === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET
    const fa = jwt.verify(token, tokenType)
}

// checks if accessToken is valid
export const checkAccessTokenValidity = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (authorization === undefined) {
        res.sendStatus(401)
        return
    }

    const token = authorization.split(' ')[1] // parse token value from string with format "token xyz-abc"

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, err => {
        if (err === null) {
            next()
        }
        console.log('ERRIS:', err)
        res.sendStatus(403)
    })
}

export const createAccessToken = (payload: any) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })

export const createRefreshToken = (payload: any) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' })
