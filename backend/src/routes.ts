import { Express } from 'express'
import { createUser, loginUser, logoutUser, renewAccessToken, varifyRefreshToken } from './controllers.js'

export const initRoutes = (app: Express) => {
    app.all('/login', loginUser)
    app.all('/signup', createUser)
    app.all('/renewtoken', renewAccessToken)
    app.all('/logout', logoutUser)
    app.all('/varifyRefreshToken', varifyRefreshToken)
}
