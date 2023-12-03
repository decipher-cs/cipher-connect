import { SessionData } from 'express-session'
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development' // Cant be development unless NODE_ENV=development is set in the scripts insdie package.json
            SECRET: string | undefined
            PORT: string | undefined
            CLIENT_URL: string | undefined
            SESSION_SECRET: string | undefined
            UPLOADTHING_SECRET: string | undefined
            UPLOADTHING_APP_ID: string | undefined
            DATABASE_URL: string | undefined
        }
    }

    namespace cookieParser {
        interface CookieParseOptions {
            token: string
        }
    }
}

declare module 'express-session' {
    export interface SessionData {
        username?: string | undefined
    }
}

export {}
