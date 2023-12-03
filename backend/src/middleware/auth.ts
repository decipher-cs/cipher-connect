import { NextFunction, Request, Response } from 'express'

export const isUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.username && req.session.id) next()
    else {
        res.redirect(401, '/logout')
        // res.sendStatus(401)
        return
    }
}
