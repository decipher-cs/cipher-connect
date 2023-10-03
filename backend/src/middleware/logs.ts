import { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'

export const reqLogger = async (req: Request, res: Response, next: NextFunction) => {
    const {
        method,
        url,
        headers: { origin },
    } = req
    const currTimeInUTC = new Date().toUTCString()
    const log = `\n${currTimeInUTC}\t${method}\t${origin}${url}`

    fs.appendFile('./logs/requestLogs.txt', log)

    next()
}
