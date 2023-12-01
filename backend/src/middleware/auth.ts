import { NextFunction, Request, Response } from 'express'

export const isUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.session.username && req.session.id)
    if (req.session.username && req.session.id) next()
    else {
        res.sendStatus(401)
        return
    }
}
