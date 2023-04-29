import express, { Express } from 'express'
import { createUser, loginUser } from './controllers/index.js'

export const initRoutes = (app: Express) => {
    app.all('/login', loginUser)
    app.all('/signup', createUser)
}
