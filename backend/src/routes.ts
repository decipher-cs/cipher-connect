import express, { Express } from 'express'

export const initRoutes = (app: Express) => {
    app.get('/', (_, res) => {
        res.send('we are done here!')
    })

    app.all('/login', (req, res) => {
        const user = { name: 'holler' }
        console.log('requested body', user)
        res.send('we are done here!')
    })
}
