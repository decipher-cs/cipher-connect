import express, { Express } from 'express'
import { loginUser } from './controllers/index.js'

export const initRoutes = (app: Express) => {
    app.all('/login', loginUser)
}
