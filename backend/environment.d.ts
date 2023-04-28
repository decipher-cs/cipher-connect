declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SECRET: string
            DEV_PORT: number
            ORIGIN_DEV_URL: string
            // ORIGIN_PROD_URL: string
        }
    }
}

export {}
