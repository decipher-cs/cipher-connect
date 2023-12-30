import { SessionData } from 'express-session'
import { Request } from 'express'
import { UploadFileResponse } from 'uploadthing/client'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development' // Cant be development unless NODE_ENV=development is set in the scripts inside package.json
            PORT: string | undefined
            SESSION_SECRET: string | undefined
            UPLOADTHING_SECRET: string | undefined
            DATABASE_URL: string | undefined
        }
    }
    declare namespace Express {
        export interface Request {
            mediaUploadData?: Omit<UploadFileResponse<null>, 'serverData'> | null
        }
    }
}

declare module 'express-session' {
    export interface SessionData {
        username?: string | undefined
    }
}

export {}
