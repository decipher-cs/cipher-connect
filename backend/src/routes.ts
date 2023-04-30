import { Express } from 'express'
import { createUser, loginUser } from './controllers.js'

export const initRoutes = (app: Express) => {
    app.all('/login', loginUser)
    app.all('/signup', createUser)
}
