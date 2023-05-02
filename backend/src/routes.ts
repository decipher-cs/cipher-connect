import { Express } from 'express'
import { createUser, loginUser, renewAccessToken } from './controllers.js'
import jwt, { JsonWebTokenError, Jwt } from 'jsonwebtoken'

export const initRoutes = (app: Express) => {
    app.all('/login', loginUser)
    app.all('/signup', createUser)
    app.all('/renewtoken', renewAccessToken)
}
