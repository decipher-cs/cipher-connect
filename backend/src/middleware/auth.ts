import { NextFunction, Request, Response } from 'express'

export const isUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    console.log('credentials are:', req.session.id, req.session.username)
    if (req.session.username && req.session.id) next()
    else {
        res.sendStatus(401)
        return
    }
}
