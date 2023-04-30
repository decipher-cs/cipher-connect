declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development' // Cant be development unless NODE_ENV=development is set in the scripts insdie package.json
            SECRET: string
            DEV_PORT: number
            ORIGIN_DEV_URL: string
            ORIGIN_PROD_URL: string
            ACCESS_TOKEN_SECRET: string
            REFRESH_TOKEN_SECRET: string
        }
    }
}

export {}
