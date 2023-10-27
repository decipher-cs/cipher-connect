declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development' // Cant be development unless NODE_ENV=development is set in the scripts insdie package.json
            SECRET: string
            PORT: number
            CLIENT_URL: string
            ACCESS_TOKEN_SECRET: string
            REFRESH_TOKEN_SECRET: string
            UPLOADTHING_SECRET: string
            UPLOADTHING_APP_ID: string
        }
    }
    namespace cookieParser {
        interface CookieParseOptions {
            token: string
        }
    }
}

export {}
