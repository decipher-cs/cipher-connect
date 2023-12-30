import { NextFunction, Request, Response } from 'express'
import { UTApi } from 'uploadthing/server'
import * as dotenv from 'dotenv'

dotenv.config()

const utapi = new UTApi()

export const uploadMediaToUploadthing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) throw new Error('no file to upload')

        const { buffer, mimetype, originalname, size } = req.file

        if (!buffer) throw new Error('empty buffer for file')

        const imageBlob = new Blob([buffer], { type: mimetype })

        const { data, error } = await utapi.uploadFiles(imageBlob, { metadata: { mimetype, name: originalname } })

        if (error) throw new Error('Error uploading file')

        req.mediaUploadData = data
    } catch (error) {
        req.mediaUploadData = undefined
    }
    next()
}
